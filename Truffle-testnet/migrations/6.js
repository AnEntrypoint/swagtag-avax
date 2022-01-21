const swagtag = artifacts.require("Swagtag");

const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
const existing = await swagtag.deployed();
  await upgradeProxy(existing.address, swagtag, { deployer, kind:'uups' });
};
