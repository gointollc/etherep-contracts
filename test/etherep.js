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
            return rep.getFee();

        }).then(function(trans) {
            
            return rep.rate(joe, 5, {from: mary, value: fee, gas: 200000});

        }).then(function(trans) {
            
            return rep.getScore(joe);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 500, "score does not appear to have been set");

        });

    });

    /* NOTE: This is the only test to use getScoreAndCount */
    it("should add an unweighted negative rating of -5 by mary for sam", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;
            return rep.getFee();

        }).then(function(trans) {
            
            return rep.rate(sam, -5, {from: mary, value: fee, gas: 200000});

        }).then(function(trans) {
            
            return rep.getScoreAndCount(sam);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval[0]), -500, "score does not appear to have been set");

        });

    });

    it("should add an unweighted rating of 5 by pat for mary", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.rate(mary, 5, {from: pat, value: fee});

        }).then(function(trans) {
            
            return rep.getScore(mary);

        }).then(function(retval) {
            
            assert.equal(parseInt(retval), 500, "score does not appear to have been set");

        });

    });

    it("mary should add weighted rating of 3 to pat equaling 3.8", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.rate(pat, 3, {from: mary, value: fee});
            

        }).then(function(trans) {
            
            return rep.getScore(pat);

        }).then(function(score) {
            
            assert.equal(parseInt(score), 380, "score should be exactly 380 weight weight");

        });

    });

    it("joe and sam should add weighted ratings of 3 to pat", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;
            
            return rep.rate(pat, 3, {from: joe, value: fee});
            
        }).then(function(trans) {
            
            return rep.rate(pat, 3, {from: sam, value: fee});
            
        }).then(function(trans) {
            
            return rep.getScore(pat);

        }).then(function(score) {
            
            assert.isAbove(parseInt(score), 300, "score does not appear to have been weighted");

        });

    });

    it("joe should add weighted rating to mary but she should return no more than a score of 5", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;
            
            return rep.rate(mary, 5, {from: joe, value: fee});
            
        }).then(function(trans) {
            
            return rep.getScore(mary);

        }).then(function(score) {
            
            assert.equal(parseInt(score), 500, "score should be 500");

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

    it("should set manager to pat", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return rep.setManager(pat, {from: manager});

        }).then(function(trans) {

            return rep.getManager();

        }).then(function(retval) {
            
            assert.equal(retval, pat, "new manager should be pat");
            manager = pat;

        });

    });

    it("should drain the contract of fees to manager", function() {

        var rep;

        var managerInitial = 0;
        var managerFinal = 0;
        var gasUsed = 0;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            return web3.eth.getBalance(manager, function(err, res) {
                managerInitial = res;
            });

        }).then(function(trans) {

            return rep.drain({from: manager, gas: 150000});

        }).then(function(trans) {
            
            // based on default gasPrice listed here: 
            // http://truffleframework.com/docs/advanced/configuration
            gasFees = trans.receipt.gasUsed * 100000000000;
            
            return web3.eth.getBalance(Etherep.address, function(err, res) {
                assert.equal(0, res, "contract should have 0 balance");
            });

        }).then(function(retval) {

            return web3.eth.getBalance(manager, function(err, res) {
                managerFinal = parseInt(res);
                assert.isAbove(managerFinal, managerInitial - gasFees, "manager should have a higher balance");
            });

        });

    });

});