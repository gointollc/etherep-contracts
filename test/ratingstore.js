var RatingStore = artifacts.require("RatingStore");

function calcScore(cum, tot) {
    if (tot == 0) return 0;
    return cum / (tot * 100);
}

contract("RatingStore", function(accounts) {

    var manager = accounts[0];

    it("should show manager as account given in constructor", function() {

        return RatingStore.deployed().then(function(instance) {

            return instance.getManager();

        }).then(function(retval) {

            assert.equal(retval, manager, "manager should be the first account");

        });

    });

    it("should set the manager's score to 5", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {
            
            store = instance;
            return store.set(manager, 500, 1, {gas: 160000});

        }).then(function(retval) {

            return store.get(manager);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            assert.equal(score, 5, "set did not set 5");

        });

    });

    it("should add a new unweighted rating of 5", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.add(manager, 500);

        }).then(function(retval) {

            return store.get(manager);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            
            assert.equal(retval[0], 1000, "cumulative score should be 1000");
            assert.equal(score, 5, "score is not 5");

        });

    });

    it("should reset the manager's score to 0", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.reset(manager);

        }).then(function(retval) {

            return store.get(manager);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            assert.equal(score, 0, "score should show 0 after reset");

        });

    });

    it("should change controller to third account", function() {
        var store;
        return RatingStore.deployed().then(function(instance) {
            store = instance;
            return store.setController(accounts[2], {from: manager});

        }).then(function(retval) {

            return store.getController();

        }).then(function(retval) {

            assert.equal(retval, accounts[2], "controller should now be the third account");

        });

    });

    it("should change manager to second account", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;
            return store.setManager(accounts[1]);

        }).then(function(retval) {

            return store.getManager();

        }).then(function(retval) {

            // Change manager here, too
            manager = retval;

            assert.equal(retval, accounts[1], "manager should now be the second account");

        });

    });

    it("should set debug to true", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;

            return store.setDebug(true, { from: manager });

        }).then(function(retval) {

            return store.getDebug();

        }).then(function(retval) {

            assert.isTrue(retval, "debug should be set true");

        });

    });

    it("should set debug to false", function() {

        var store;

        return RatingStore.deployed().then(function(instance) {

            store = instance;

            return store.setDebug(false, { from: manager });

        }).then(function(retval) {

            return store.getDebug();

        }).then(function(retval) {

            assert.isFalse(retval, "debug should be set false");

        });

    });

});