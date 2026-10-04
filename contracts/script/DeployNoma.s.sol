// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {NomaScheduleRegistry} from "../src/NomaScheduleRegistry.sol";
import {DirectTransferAdapter} from "../src/adapters/DirectTransferAdapter.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

/// @dev Deploy to Monad testnet (chain ID 10143). Log addresses for frontend `.env.local`.
contract DeployNoma is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        MockERC20 token = new MockERC20();
        DirectTransferAdapter adapter = new DirectTransferAdapter();
        NomaScheduleRegistry registry = new NomaScheduleRegistry(adapter);

        token.mint(deployer, 1_000_000 ether);

        vm.stopBroadcast();

        console2.log("NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS=", address(token));
        console2.log("NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS=", address(adapter));
        console2.log("NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS=", address(registry));
        console2.log("NEXT_PUBLIC_PAYOUT_SINK_ADDRESS=", deployer);
        console2.log("NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS=18");
    }
}
