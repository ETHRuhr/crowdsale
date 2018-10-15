const moment = require('moment');

const RuhrToken = artifacts.require("./RuhrToken.sol");
const RuhrCrowdsale = artifacts.require("./RuhrCrowdsale.sol");
const RuhrCrowdsaleDeployer = artifacts.require("./RuhrCrowdsaleDeployer.sol");

module.exports = function(deployer) {
  const wallet = '0x38D1Ea5E7EA932E83b482F4816F2ee1C61A288c2';
  const openingTime = moment("20181017", "YYYYMMDD");
  const closingTime = openingTime.add(2, 'weeks');

  deployer.deploy(
      RuhrCrowdsaleDeployer,
      wallet,
      openingTime.unix(),
      closingTime.unix()
  );
};
