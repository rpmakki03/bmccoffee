// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BuyMeACoffee
/// @notice Accepts tips with a message, forwards ETH to a fixed recipient, and stores messages
contract BuyMeACoffee {
    /// @dev Message structure storing sender, message text, and timestamp
    struct CoffeeMessage {
        address sender;
        string message;
        uint256 timestamp;
    }

    /// @notice Emitted whenever someone buys a coffee
    /// @param sender The address that sent the tip
    /// @param amount The amount of ETH sent
    /// @param message The message attached to the tip
    /// @param timestamp The block timestamp when the tip was sent
    event CoffeePurchased(address indexed sender, uint256 amount, string message, uint256 timestamp);

    /// @notice Total number of coffees purchased
    uint256 public coffeeCount;

    /// @notice List of all messages
    CoffeeMessage[] private messages;

    /// @dev Fixed recipient address for all tips
    address payable public constant RECIPIENT = payable(0xa30C31bf4f1713d95b403b7E12d63cE99ed8163d);

    /// @notice Buy a coffee by sending ETH along with a message
    /// @param message The message to include with the tip
    function buyCoffee(string memory message) external payable {
        require(msg.value > 0, "No ETH sent");

        coffeeCount += 1;
        messages.push(CoffeeMessage({sender: msg.sender, message: message, timestamp: block.timestamp}));

        (bool success, ) = RECIPIENT.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit CoffeePurchased(msg.sender, msg.value, message, block.timestamp);
    }

    /// @notice Returns all stored messages
    function getMessages() external view returns (CoffeeMessage[] memory) {
        return messages;
    }
}



