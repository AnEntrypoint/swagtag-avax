const swagtag = artifacts.require("Swagtag");

const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
 const existing =  await deployProxy(swagtag, [], {deployer, kind:'uups'});
};
