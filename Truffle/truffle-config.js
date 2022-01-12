const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = new Web3(`https://api.avax.network/ext/bc/C/rpc`)
//const provider = new Web3.providers.HttpProvider(
//  `https://api.avax-test.network/ext/bc/C/rpc`
//);

const privateKeys = [
  "",
];

module.exports = {
  compilers: {
    solc: {
      version: "0.8.11" 
    }
  },
  networks: {
    development: {
      provider: () => {
        return new HDWalletProvider({
           privateKeys: privateKeys,
          providerOrUrl: `https://api.avax.network/ext/bc/C/rpc`,
        });
      },
      network_id: "*",
      gas: 8000000,
      gasPrice: 225000000000,
    },
  },
};