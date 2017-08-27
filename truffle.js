module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 7545,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    }
  }
};
