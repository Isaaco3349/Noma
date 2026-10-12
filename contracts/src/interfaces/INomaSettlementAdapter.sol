// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title INomaSettlementAdapter
 * @notice Pulls settlement token from the payer for Nigeria-corridor orchestration.
 * @dev Direct ERC-20 adapter today. Agora Stablecoin API adapter may implement this later.
 */
interface INomaSettlementAdapter {
    function executeSettlement(
        address payer,
        address token,
        address payoutSink,
        bytes32 beneficiaryRef,
        uint256 amount
    ) external returns (bool success);
}
