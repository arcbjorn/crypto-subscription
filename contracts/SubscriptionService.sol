// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITRC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract SubscriptionService {
    ITRC20 public usdtToken;
    uint256 public subscriptionFee;
    uint256 public subscriptionDuration;

    mapping(address => uint256) public subscriptions;
    bool private locked;

    modifier noReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _usdtTokenAddress, uint256 _fee, uint256 _duration) {
        usdtToken = ITRC20(_usdtTokenAddress);
        subscriptionFee = _fee;
        subscriptionDuration = _duration;
        locked = false;
    }

    function subscribe() public noReentrant {
        require(usdtToken.transferFrom(msg.sender, address(this), subscriptionFee), "Payment failed");
        _extendSubscription(msg.sender);
    }

    function renewSubscription() public noReentrant {
        require(isSubscribed(msg.sender), "Not currently subscribed");
        require(usdtToken.transferFrom(msg.sender, address(this), subscriptionFee), "Payment failed");
        _extendSubscription(msg.sender);
    }

    function cancelSubscription() public {
        require(isSubscribed(msg.sender), "Not currently subscribed");
        subscriptions[msg.sender] = block.timestamp; // Setting the timestamp to now effectively cancels it
    }

    function isSubscribed(address subscriber) public view returns (bool) {
        return subscriptions[subscriber] > block.timestamp;
    }

    function _extendSubscription(address subscriber) internal {
        if (isSubscribed(subscriber)) {
            subscriptions[subscriber] += subscriptionDuration;
        } else {
            subscriptions[subscriber] = block.timestamp + subscriptionDuration;
        }
    }
}
