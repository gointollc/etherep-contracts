var EtherepMigration = artifacts.require("EtherepMigration");
var Etherep = artifacts.require("Etherep");
var RatingStore = artifacts.require("RatingStore");

contract("EtherepMigration", function(accounts) {

    var admin = accounts[0];
    var manager = accounts[1];
    var jack = accounts[2];
    var mary = accounts[3];
    var whoever = accounts[4];

    it("should not not allow a random user to set a contract", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.setContract("ratingstore", whoever, {from: jack});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a random user to add an admin", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addAdmin(mary, {from: jack});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a random user to add a manager", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addManager(mary, {from: jack});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a manager to add an admin", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addManager(manager, {from: admin});

        })
        .then(function() {

            return mig.addAdmin(mary, {from: manager});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a manager to remove an admin", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addManager(manager, {from: admin});

        })
        .then(function() {

            return mig.removeAdmin(admin, {from: manager});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a manager to add a manager", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addManager(whoever, {from: manager});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

    it("should not not allow a manager to remove a manager", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.addManager(whoever, {from: admin});

        })
        .then(function() {

            return mig.removeManager(whoever, {from: manager});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
            
            // Cleanup
            return mig.removeManager(whoever, {from: admin});
        });

    });

    it("should not not allow an admin to remove themself", function() {

        var mig;

        return EtherepMigration.deployed().then(function(instance) {

            mig = instance;

            return mig.removeAdmin(admin, {from: admin});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, "should have thrown invalid opcode");
        });

    });

});