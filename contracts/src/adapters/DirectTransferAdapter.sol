// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "../interfaces/IERC20.sol";
import {INomaSettlementAdapter} from "../interfaces/INomaSettlementAdapter.sol";

/**
 * @notice Moves ERC-20 from payer to payout sink. Requires prior approval on `token`.
 */
contract DirectTransferAdapter is INomaSettlementAdapter {
    function executeSettlement(
        address payer,
        address token,
        address payoutSink,
        bytes32 beneficiaryRef,
        uint256 amount
    ) external returns (bool success) {
        beneficiaryRef; // indexed off-chain for NGN partner orchestration
        success = IERC20(token).transferFrom(payer, payoutSink, amount);
    }
}
