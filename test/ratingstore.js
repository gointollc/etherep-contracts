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

    /* TODO: something is wrong with the deploy
    it("should initially show controller as not the manager", function() {

        return RatingStore.deployed().then(function(instance) {

            return instance.getManager();

        }).then(function(retval) {

            assert.notEqual(retval, manager, "manager should not be the first account if deployed correctly");

        });

    });*/

    it("should set the manager's score to 5", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.set(manager, 500, 1);
            return instance.get(manager);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            assert.equal(score, 5, "set did not set 5");

        });

    });

    it("should add a new unweighted rating of 5", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.add(manager, 500);
            return instance.get(manager);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            
            assert.equal(retval[0], 1000, "cumulative score should be 1000");
            assert.equal(score, 5, "score is not 5");

        });

    });

    it("should reset the manager's score to 0", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.reset(manager);
            return instance.get(manager);

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

        return RatingStore.deployed().then(function(instance) {

            instance.setManager(accounts[1]);
            return instance.getManager();

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