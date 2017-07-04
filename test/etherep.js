var Etherep = artifacts.require("Etherep");

contract("Etherep", function(accounts) {

    var manager = accounts[0];
    var joe = accounts[1];
    var mary = accounts[2];
    var pat = accounts[3];

    it("should add an unweighted rating of 5 by mary for joe", function() {

        return Etherep.deployed().then(function(rep) {

            rep.rate(joe, 5, {from: mary, value: 200000000000000});
            return rep.getScore(joe);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 5, "score does not appear to have been set");

        });

    });

    it("should add an unweighted rating of 5 by pat for mary", function() {

        return Etherep.deployed().then(function(rep) {

            rep.rate(mary, 5, {from: pat, value: 200000000000000});
            return rep.getScore(mary);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 5, "score does not appear to have been set");

        });

    });

});