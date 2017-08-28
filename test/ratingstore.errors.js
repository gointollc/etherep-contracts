var RatingStore = artifacts.require("RatingStore");
var Etherep = artifacts.require("Etherep");

function calcScore(cum, tot) {
    if (tot == 0) return 0;
    return cum / (tot * 100);
}

contract("RatingStore", function(accounts) {

    var manager = accounts[0];
    var controller = Etherep.address;
    var rando = accounts[4];

    it("should not allow regular users to set a score", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.set(manager, 500, 10, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {
            
            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

    it("should not allow regular users to add a score", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.add(manager, 500, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {

            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

    /* TODO: Technically this should test anything but manager */
    it("should not allow regular users to reset a score", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.reset(manager, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {

            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

    /* TODO: Technically this should test anything but manager */
    it("should not allow regular users to set a manager", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.setManager(rando, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {

            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

    /* TODO: Technically this should test anything but manager */
    it("should not allow regular users to set a controller", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.setController(rando, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {

            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

    /* TODO: Technically this should test anything but manager */
    it("should not allow regular users to set debug", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.setDebug(true, {from: rando});

        })
        .then(assert.fail)
        .catch(function(err) {

            assert(err.message.indexOf('invalid opcode') >= 0, err);

        });

    });

});