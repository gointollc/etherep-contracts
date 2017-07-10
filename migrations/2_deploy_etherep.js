var RatingStore = artifacts.require("RatingStore");
var Etherep = artifacts.require("Etherep");
var EtherepMigration = artifacts.require("EtherepMigration");

module.exports = function(deployer, network, accounts) {
  var manager = accounts[0];
  var fee = 200000000000000;
  var wait = 60;

  deployer.deploy(RatingStore, manager, manager)
  // Deploy etherep
  .then(function() {
    return deployer.deploy(Etherep, manager, fee, RatingStore.address, wait);
  })
  // set controller for RatingStore
  .then(function() {
    var rs = RatingStore.at(RatingStore.address);
    return rs.setController(Etherep.address, {from: manager});
  })
  // Deploy migration contract
  .then(function() {
    var migrate;
    return deployer.deploy(EtherepMigration, manager).then(function(res) {
        migrate = EtherepMigration.at(EtherepMigration.address);
        return migrate;
    }).then(function(x) {
        return migrate.setContract('etherep', Etherep.address, {from: manager});
    }).then(function(x) {
        return migrate.setContract('ratingstore', RatingStore.address, {from: manager});
    });
  });
  
};
