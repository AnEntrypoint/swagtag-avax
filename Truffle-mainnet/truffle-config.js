const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
//const provider = new Web3.providers.HttpProvider(
//  `https://api.avax-test.network/ext/bc/C/rpc`
//);

const privateKeys = [
  "896cf2c817ef87a4964e10761308c6a06743eb4b760f0ab97fbc58837de115c8",
];

module.exports = {
  compilers: {
    solc: {
      version: "0.8.11" ,
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    }
  },
  networks: {
    testnet: {
      provider: () => {
        return new HDWalletProvider({
           privateKeys: privateKeys,
          providerOrUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
        });
      },
      network_id: "*",
      gas: 8000000,
      gasPrice: 225000000000,
      skipDryRun: true
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider({
           privateKeys: privateKeys,
          providerOrUrl: `https://api.avax.network/ext/bc/C/rpc`,
        });
      },
      network_id: "*",
      gas: 8000000,
      gasPrice: 225000000000,
      skipDryRun: true
    },
  },
};