require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  defaultNetwork: 'ganache',
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ],
  },
  networks: {
    // hardhat: {
    //   gas: 9000000000,
    //   blockGasLimit: 9000000000,
    //   allowUnlimitedContractSize: true,
    // },
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    //   gas: 150000000,
    //   blockGasLimit: 150000000,
    //   allowUnlimitedContractSize: true,
    //   throwOnTransactionFailures: true,
    //   throwOnCallFailures: true,
    //   accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"]
    // },
    ganache: {
      url: "http://127.0.0.1:7545",
      gas: 20000000000,
      // blockGasLimit: 6721975,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      accounts: ["a182030a6b1e20a5213b26c10d24cf1c9dcbb877b2a1dacb0e336161a0c9cd7c"]
    },
    drafsoln: {
      url: "http://drafsoln.asuscomm.com:8545",
      gas: 20000000000,
       blockGasLimit: 150000000,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      accounts: ["a182030a6b1e20a5213b26c10d24cf1c9dcbb877b2a1dacb0e336161a0c9cd7c"]
    },
    // forms: {
    //   url: "http://besu.formsdev.net/jsonrpc",
    //   gas: 150000000,
    //   blockGasLimit: 150000000,
    //   throwOnTransactionFailures: true,
    //   throwOnCallFailures: true,
    //   timeout: 1800000,
    //   allowUnlimitedContractSize: true,
    //   accounts: ["ca6119e124c9498943f3ae09b2ca5c0b0f7bf72fb7438dabee01146d87542dc5"]
    // },
    binance_test: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      gas: 30000000,
      blockGasLimit: 150000000,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      timeout: 1800000,
      allowUnlimitedContractSize: true,
      accounts: ["a182030a6b1e20a5213b26c10d24cf1c9dcbb877b2a1dacb0e336161a0c9cd7c"]
    },
    // moonbeam: {
    //   url: "https://rpc.testnet.moonbeam.network",
    //   gas: 1500000,
    //   blockGasLimit: 15000000,
    //   timeout: 1800000,
    //   accounts: ["1bed892bdce369c62072e9dc6d5e6a3074dc7aec8039c8ef06c1c452197876af"]
    // },
    // matic: {
    //   url: "https://matic-mumbai.chainstacklabs.com",
    //   gas: 1500000,
    //   blockGasLimit: 15000000,
    //   timeout: 1800000,
    //   accounts: ["1bed892bdce369c62072e9dc6d5e6a3074dc7aec8039c8ef06c1c452197876af"]
    // },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './artifacts'
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 1,
    enabled: false
  },
};

