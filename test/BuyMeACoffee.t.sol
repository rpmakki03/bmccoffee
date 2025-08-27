// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {BuyMeACoffee} from "contracts/BuyMeACoffee.sol";

contract BuyMeACoffeeTest is Test {
    BuyMeACoffee private coffee;

    address private constant RECIPIENT = 0xa30C31bf4f1713d95b403b7E12d63cE99ed8163d;

    function setUp() public {
        coffee = new BuyMeACoffee();
        vm.deal(address(this), 100 ether);
    }

    function testBuyCoffeeIncrementsCounterAndTransfers() public {
        uint256 beforeBalance = RECIPIENT.balance;
        coffee.buyCoffee{value: 1 ether}("Great work!");
        uint256 afterBalance = RECIPIENT.balance;
        assertEq(coffee.coffeeCount(), 1);
        assertEq(afterBalance - beforeBalance, 1 ether);

        BuyMeACoffee.CoffeeMessage[] memory messages = coffee.getMessages();
        assertEq(messages.length, 1);
        assertEq(messages[0].sender, address(this));
        assertEq(messages[0].message, "Great work!");
    }

    function testRevertWhenNoValue() public {
        vm.expectRevert(bytes("No ETH sent"));
        coffee.buyCoffee("Oops");
    }
}


