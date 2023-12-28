module.exports = {
  networks: {
    // Configuration for local development
    development: {
      privateKey: "YOUR_PRIVATE_KEY",
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullHost: "http://127.0.0.1:9090",
      network_id: "*", // Match any network id
    },

    // Configuration for Shasta testnet
    shasta: {
      privateKey: "YOUR_SHASTA_PRIVATE_KEY",
      consume_user_resource_percent: 30,
      fee_limit: 100000000,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*", // Match any network id
    },

    // Configuration for Tron mainnet
    mainnet: {
      privateKey: "YOUR_MAINNET_PRIVATE_KEY",
      consume_user_resource_percent: 30,
      fee_limit: 1000000000,
      fullHost: "https://api.trongrid.io",
      network_id: "*", // Match any network id
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0", // Use this version of the Solidity compiler
    },
  },
};
