// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {INomaSettlementAdapter} from "./interfaces/INomaSettlementAdapter.sol";

/**
 * @title NomaScheduleRegistry
 * @notice On-chain authorization, spend limits, and recurring schedules for Noma payment plans.
 * @dev Corridor: Nigeria orchestration only (beneficiaryRef is off-chain). Settlement token address
 *      is supplied per plan — use verified AUSD on Monad when available (TODO(verify)).
 */
contract NomaScheduleRegistry {
    enum ScheduleKind {
        OneTime,
        Monthly,
        Weekly
    }

    struct Plan {
        address owner;
        address token;
        address payoutSink;
        bytes32 beneficiaryRef;
        uint96 amountPerExecution;
        uint96 maxTotalSpend;
        uint96 spentTotal;
        ScheduleKind schedule;
        uint8 dayOfMonth;
        uint32 periodSeconds;
        uint64 nextExecutionAt;
        bool active;
    }

    INomaSettlementAdapter public immutable settlementAdapter;

    uint256 public nextPlanId = 1;
    mapping(uint256 planId => Plan) public plans;
    mapping(address owner => mapping(address executor => bool)) public executors;

    uint256 public constant MAX_DAY_OF_MONTH = 28;
    uint256 public constant SECONDS_PER_WEEK = 7 days;
    uint256 public constant SECONDS_PER_MONTH = 30 days;

    event ExecutorUpdated(address indexed owner, address indexed executor, bool allowed);
    event PlanCreated(
        uint256 indexed planId,
        address indexed owner,
        bytes32 beneficiaryRef,
        uint96 amountPerExecution,
        uint96 maxTotalSpend,
        ScheduleKind schedule
    );
    event PlanCancelled(uint256 indexed planId, address indexed owner);
    event PlanExecuted(
        uint256 indexed planId,
        address indexed caller,
        uint96 amount,
        uint96 spentTotal,
        uint64 nextExecutionAt
    );

    error NotOwner();
    error NotAuthorized();
    error PlanInactive();
    error TooEarly();
    error ExceedsPlanCap();
    error InvalidSchedule();
    error InvalidAmount();
    error SettlementFailed();

    constructor(INomaSettlementAdapter adapter) {
        settlementAdapter = adapter;
    }

    function setExecutor(address executor, bool allowed) external {
        executors[msg.sender][executor] = allowed;
        emit ExecutorUpdated(msg.sender, executor, allowed);
    }

    function createPlan(
        address token,
        address payoutSink,
        bytes32 beneficiaryRef,
        uint96 amountPerExecution,
        uint96 maxTotalSpend,
        ScheduleKind schedule,
        uint8 dayOfMonth,
        uint64 firstExecutionAt
    ) external returns (uint256 planId) {
        if (amountPerExecution == 0 || maxTotalSpend == 0) revert InvalidAmount();
        if (amountPerExecution > maxTotalSpend) revert ExceedsPlanCap();
        if (token == address(0) || payoutSink == address(0)) revert InvalidAmount();

        uint32 periodSeconds = 0;
        if (schedule == ScheduleKind.Monthly) {
            if (dayOfMonth == 0 || dayOfMonth > MAX_DAY_OF_MONTH) revert InvalidSchedule();
            periodSeconds = uint32(SECONDS_PER_MONTH);
        } else if (schedule == ScheduleKind.Weekly) {
            periodSeconds = uint32(SECONDS_PER_WEEK);
        } else if (schedule == ScheduleKind.OneTime) {
            if (dayOfMonth != 0) revert InvalidSchedule();
        } else {
            revert InvalidSchedule();
        }

        uint64 startAt =
            firstExecutionAt == 0 ? uint64(block.timestamp) : firstExecutionAt;

        planId = nextPlanId++;
        plans[planId] = Plan({
            owner: msg.sender,
            token: token,
            payoutSink: payoutSink,
            beneficiaryRef: beneficiaryRef,
            amountPerExecution: amountPerExecution,
            maxTotalSpend: maxTotalSpend,
            spentTotal: 0,
            schedule: schedule,
            dayOfMonth: dayOfMonth,
            periodSeconds: periodSeconds,
            nextExecutionAt: startAt,
            active: true
        });

        emit PlanCreated(
            planId,
            msg.sender,
            beneficiaryRef,
            amountPerExecution,
            maxTotalSpend,
            schedule
        );
    }

    function cancelPlan(uint256 planId) external {
        Plan storage plan = plans[planId];
        if (plan.owner != msg.sender) revert NotOwner();
        plan.active = false;
        emit PlanCancelled(planId, msg.sender);
    }

    function executePlan(uint256 planId) external {
        Plan storage plan = plans[planId];
        if (!plan.active) revert PlanInactive();
        if (!_isAuthorized(plan.owner, msg.sender)) revert NotAuthorized();
        if (block.timestamp < plan.nextExecutionAt) revert TooEarly();

        uint96 amount = plan.amountPerExecution;
        if (plan.spentTotal + amount > plan.maxTotalSpend) revert ExceedsPlanCap();

        bool ok = settlementAdapter.executeSettlement(
            plan.owner,
            plan.token,
            plan.payoutSink,
            plan.beneficiaryRef,
            amount
        );
        if (!ok) revert SettlementFailed();

        plan.spentTotal += amount;

        if (plan.schedule == ScheduleKind.OneTime) {
            plan.active = false;
            plan.nextExecutionAt = 0;
        } else {
            plan.nextExecutionAt = _nextDue(plan);
        }

        emit PlanExecuted(planId, msg.sender, amount, plan.spentTotal, plan.nextExecutionAt);
    }

    function _isAuthorized(address owner, address caller) internal view returns (bool) {
        return caller == owner || executors[owner][caller];
    }

    function _nextDue(Plan storage plan) internal view returns (uint64) {
        if (plan.schedule == ScheduleKind.Weekly) {
            return plan.nextExecutionAt + plan.periodSeconds;
        }
        return plan.nextExecutionAt + uint64(SECONDS_PER_MONTH);
    }
}
