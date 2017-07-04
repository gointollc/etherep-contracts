var RatingStore = artifacts.require("RatingStore");

function calcScore(cum, tot) {
    if (tot == 0) return 0;
    return cum / (tot * 100);
}

contract("RatingStore", function(accounts) {

    it("should set the manager's score to 5", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.set(accounts[0], 500, 1);
            return instance.get(accounts[0]);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            assert.equal(score, 5, "set did not set 5");

        });

    });

    it("should add a new unweighted rating of 5", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.add(accounts[0], 500);
            return instance.get(accounts[0]);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            
            assert.equal(retval[0], 1000, "cumulative score should be 1000");
            assert.equal(score, 5, "score is not 5");

        });

    });

    it("should reset the manager's score to 0", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.reset(accounts[0]);
            return instance.get(accounts[0]);

        }).then(function(retval) {
            
            var score = calcScore(retval[0], retval[1]);
            assert.equal(score, 0, "score should show 0 after reset");

        });

    });

    it("should change manager to second account", function() {

        return RatingStore.deployed().then(function(instance) {

            instance.setManager(accounts[1]);
            return instance.getManager();

        }).then(function(retval) {

            assert.equal(retval, accounts[1], "manager should now be the second account");

        });

    });

});