import { assert } from "chai";
import { artifacts, contract, web3 } from "tronbox";
import BigNumber from "bignumber.js";

const SubscriptionService = artifacts.require("SubscriptionService");
const TRC20Mock = artifacts.require("TRC20Mock");

contract("SubscriptionService", (accounts: string[]) => {
  let subscriptionService: any;
  let usdtToken: any;
  const owner = accounts[0];
  const subscriber = accounts[1];
  const subscriptionFee = new BigNumber(web3.utils.toWei("1", "ether")); // Assuming 1 USDT is represented like 1 Ether for testing
  const subscriptionDuration = 30 * 24 * 60 * 60; // 30 days in seconds

  before(async () => {
    usdtToken = await TRC20Mock.new("Mock USDT", "mUSDT", 18);
    subscriptionService = await SubscriptionService.new(
      usdtToken.address,
      subscriptionFee.toString(),
      subscriptionDuration
    );

    await usdtToken.transfer(subscriber, web3.utils.toWei("10", "ether"), {
      from: owner,
    });
  });

  describe("Subscribing", () => {
    it("should allow a user to subscribe", async () => {
      await usdtToken.approve(
        subscriptionService.address,
        subscriptionFee.toString(),
        { from: subscriber }
      );
      await subscriptionService.subscribe({ from: subscriber });

      const isSubscribed = await subscriptionService.isSubscribed(subscriber);
      assert.isTrue(isSubscribed, "The user should be subscribed.");
    });
  });

  describe("Renewing Subscription", () => {
    it("should allow a user to renew their subscription", async () => {
      await usdtToken.approve(
        subscriptionService.address,
        subscriptionFee.toString(),
        { from: subscriber }
      );
      await subscriptionService.renewSubscription({ from: subscriber });

      const expiryTime = await subscriptionService.subscriptions(subscriber);
      assert(
        expiryTime.toNumber() > subscriptionDuration + subscriptionDuration,
        "The subscription should be extended."
      );
    });
  });

  describe("Cancelling Subscription", () => {
    it("should allow a user to cancel their subscription", async () => {
      await subscriptionService.cancelSubscription({ from: subscriber });

      const isSubscribed = await subscriptionService.isSubscribed(subscriber);
      assert.isFalse(
        isSubscribed,
        "The user should not be subscribed anymore."
      );
    });
  });
});
