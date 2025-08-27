// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {BuyMeACoffee} from "contracts/BuyMeACoffee.sol";

contract DeployScript is Script {
    function run() external returns (BuyMeACoffee deployed) {
        vm.startBroadcast();
        deployed = new BuyMeACoffee();
        vm.stopBroadcast();
    }
}


