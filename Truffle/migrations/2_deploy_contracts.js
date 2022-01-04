const DNS = artifacts.require("UDNS");

module.exports = async function(deployer) {
  deployer.deploy(DNS);
};
