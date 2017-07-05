var Etherep = artifacts.require("Etherep");

contract("Etherep", function(accounts) {

    var manager = accounts[0];
    var joe = accounts[1];
    var mary = accounts[2];
    var pat = accounts[3];
    var sam = accounts[4];

    it("should set debug to on", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setDebug(true, {from: manager});

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

});