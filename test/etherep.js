var Etherep = artifacts.require("Etherep");

contract("Etherep", function(accounts) {

    var fee = 200000000000000;
    var manager = accounts[0];
    var joe = accounts[1];
    var mary = accounts[2];
    var pat = accounts[3];
    var sam = accounts[4];

    it("should set debug to off", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setDebug(false, {from: manager});

        }).then(function(retval) {

            return rep.getDebug();

        }).then(function(retval) {

            assert.isFalse(retval, "debug should be off");

        });

    });

    it("should set debug to on", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setDebug(true, {from: manager});

        }).then(function(retval) {

            return rep.getDebug();

        }).then(function(retval) {

            assert.isTrue(retval, "debug should be on");

        });

    });

    it("should add an unweighted rating of 5 by mary for joe", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.rate(joe, 5, {from: mary, value: 200000000000000});

        }).then(function(trans) {
            
            return rep.getScore(joe);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 500, "score does not appear to have been set");

        });

    });

    it("should add an unweighted rating of 5 by pat for mary", function() {

        return Etherep.deployed().then(function(rep) {

            rep.rate(mary, 5, {from: pat, value: 200000000000000});
            return rep.getScore(mary);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 500, "score does not appear to have been set");

        });

    });

    it("joe, sam, and mary should add weighted ratings of 3 to pat", function() {

        return Etherep.deployed().then(function(rep) {

            rep.rate(pat, 3, {from: mary, value: 200000000000000});
            rep.rate(pat, 3, {from: joe, value: 200000000000000});
            rep.rate(pat, 3, {from: sam, value: 200000000000000});
            return rep.getScore(pat);

        }).then(function(score) {
            
            assert.isAbove(parseInt(score), 300, "score does not appear to have been weighted");

        });

    });

    it("should change fee to twice the original", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setFee(fee * 2, {from: manager});

        }).then(function(trans) {

            return rep.getFee();

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), fee * 2, "fee does not appear to have been changed");

        });

    });

    it("should set rating delay to 1 hour", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setDelay(3600, {from: manager});

        }).then(function(trans) {

            return rep.getDelay();

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 3600, "delay does not appear to have been changed");

        });

    });

});