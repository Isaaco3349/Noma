// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20} from "../src/mocks/MockERC20.sol";

/// @dev Mint demo settlement token to a Mera passkey address (or any recipient).
/// Env: DEPLOYER_PRIVATE_KEY, SETTLEMENT_TOKEN_ADDRESS, MINT_TO, optional MINT_AMOUNT_WEI (default 1000 ether).
contract MintMockToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address token = vm.envAddress("SETTLEMENT_TOKEN_ADDRESS");
        address to = vm.envAddress("MINT_TO");
        uint256 amount = vm.envOr("MINT_AMOUNT_WEI", uint256(1000 ether));

        vm.startBroadcast(deployerPrivateKey);
        MockERC20(token).mint(to, amount);
        vm.stopBroadcast();

        console2.log("MINT_TO=", to);
        console2.log("SETTLEMENT_TOKEN_ADDRESS=", token);
        console2.log("MINT_AMOUNT_WEI=", amount);
    }
}
