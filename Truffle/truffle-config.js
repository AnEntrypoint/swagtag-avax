const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = new Web3(`https://api.avax-test.network/ext/bc/C/rpc`)
//const provider = new Web3.providers.HttpProvider(
//  `https://api.avax-test.network/ext/bc/C/rpc`
//);

const privateKeys = [
  "0x10289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8021",
  "0x294198529994b0dc604278c99d153cfd069d594753d471171a1d102a10438e02",
  "0x38614556be13730e9e8d6eacc1603143e7b96987429df8726384c2ec4502ef63",
  "0x47b571bf6894a248831ff937bb49f7754509fe93bbd2517c9c73c4144c0e97d4",
  "0x5634bef917e01692b789da754a0eae31a8536eb465e7bff752ea291dad88c675",
  "0x6500bdbdbc279b808b1ec45f8c2370e4616d3a02c336e68d85d4668e08f53cf6",
  "0x74c2865b76ba28016bc2255c7504d000e046ae01934b04c694592a6276988637",
  "0x83bfd34f687ced8c6968854f8a99ae47712c4f4183b78dcc4a903d1bfe8cbf68",
  "0x92f78c5416151fe3546dece84fda4b4b1e36089f2dbc48496faf3a950f161579",
  "0x010839e9dbbd2a0910efe40f50b2f3b2f2f59f5580bb4b83bd8c1201cf9a0100",
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