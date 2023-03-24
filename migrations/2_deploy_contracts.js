const LandRegistrationSystem = artifacts.require("LandRegistrationSystem");

module.exports = function (deployer) {
  deployer.deploy(LandRegistrationSystem);
};
