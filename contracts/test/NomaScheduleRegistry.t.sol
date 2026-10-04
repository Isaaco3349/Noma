// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {NomaScheduleRegistry} from "../src/NomaScheduleRegistry.sol";
import {DirectTransferAdapter} from "../src/adapters/DirectTransferAdapter.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

contract NomaScheduleRegistryTest is Test {
    NomaScheduleRegistry internal registry;
    DirectTransferAdapter internal adapter;
    MockERC20 internal token;

    address internal owner = address(0xA11CE);
    address internal sink = address(0xB0B);
    address internal relayer = address(0xBEEF);
    bytes32 internal beneficiaryRef = keccak256("mum-lagos-ng");

    function _planMeta(uint256 planId)
        internal
        view
        returns (uint96 spentTotal, uint64 nextExecutionAt, bool active)
    {
        (
            ,
            ,
            ,
            ,
            ,
            ,
            uint96 spent,
            ,
            ,
            ,
            uint64 nextDue,
            bool isActive
        ) = registry.plans(planId);
        return (spent, nextDue, isActive);
    }

    function setUp() public {
        adapter = new DirectTransferAdapter();
        registry = new NomaScheduleRegistry(adapter);
        token = new MockERC20();

        vm.startPrank(owner);
        token.mint(owner, 1_000 ether);
        token.approve(address(adapter), type(uint256).max);
        vm.stopPrank();
    }

    function test_createAndExecuteOneTimePlan() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            100 ether,
            100 ether,
            NomaScheduleRegistry.ScheduleKind.OneTime,
            0,
            0
        );

        vm.prank(owner);
        registry.executePlan(planId);

        assertEq(token.balanceOf(sink), 100 ether);
        (,, bool active) = _planMeta(planId);
        assertFalse(active);

        vm.prank(owner);
        vm.expectRevert(NomaScheduleRegistry.PlanInactive.selector);
        registry.executePlan(planId);
    }

    function test_revertsWhenExceedingMaxTotalSpend() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            60 ether,
            100 ether,
            NomaScheduleRegistry.ScheduleKind.Monthly,
            2,
            0
        );

        vm.startPrank(owner);
        registry.executePlan(planId);
        vm.warp(block.timestamp + registry.SECONDS_PER_MONTH());
        vm.expectRevert(NomaScheduleRegistry.ExceedsPlanCap.selector);
        registry.executePlan(planId);
        vm.stopPrank();
    }

    function test_revertsWhenExecutingTooEarly() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            10 ether,
            50 ether,
            NomaScheduleRegistry.ScheduleKind.Weekly,
            0,
            uint64(block.timestamp + 1 days)
        );

        vm.prank(owner);
        vm.expectRevert(NomaScheduleRegistry.TooEarly.selector);
        registry.executePlan(planId);
    }

    function test_cancelPreventsExecution() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            10 ether,
            10 ether,
            NomaScheduleRegistry.ScheduleKind.OneTime,
            0,
            0
        );

        vm.prank(owner);
        registry.cancelPlan(planId);

        vm.prank(owner);
        vm.expectRevert(NomaScheduleRegistry.PlanInactive.selector);
        registry.executePlan(planId);
    }

    function test_authorizedExecutorCanRunPlan() public {
        vm.startPrank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            25 ether,
            25 ether,
            NomaScheduleRegistry.ScheduleKind.OneTime,
            0,
            0
        );
        registry.setExecutor(relayer, true);
        vm.stopPrank();

        vm.prank(relayer);
        registry.executePlan(planId);
        assertEq(token.balanceOf(sink), 25 ether);
    }

    function test_unauthorizedExecutorReverts() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            5 ether,
            5 ether,
            NomaScheduleRegistry.ScheduleKind.OneTime,
            0,
            0
        );

        vm.prank(relayer);
        vm.expectRevert(NomaScheduleRegistry.NotAuthorized.selector);
        registry.executePlan(planId);
    }

    function test_monthlyPlanSchedulesNextExecution() public {
        vm.prank(owner);
        uint256 planId = registry.createPlan(
            address(token),
            sink,
            beneficiaryRef,
            10 ether,
            100 ether,
            NomaScheduleRegistry.ScheduleKind.Monthly,
            2,
            0
        );

        (uint96 spentBefore, uint64 firstDue, bool activeBefore) = _planMeta(planId);
        spentBefore;
        assertTrue(activeBefore);
        vm.warp(firstDue);

        vm.prank(owner);
        registry.executePlan(planId);

        (uint96 spentTotal, uint64 nextDue, bool activeAfter) = _planMeta(planId);
        assertEq(spentTotal, 10 ether);
        assertEq(nextDue, firstDue + uint64(registry.SECONDS_PER_MONTH()));
        assertTrue(activeAfter);
    }
}
