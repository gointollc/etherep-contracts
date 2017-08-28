var Etherep = artifacts.require("Etherep");

contract("Etherep", function(accounts) {

    var fee = 200000000000000;
    var manager = accounts[0];
    var joe = accounts[1];
    var mary = accounts[2];
    var pat = accounts[3];
    var sam = accounts[4];

    it("joe should not be able to rate himself", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.rate(joe, 5, {from: joe, value: fee});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not accept a rating of above 5", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.rate(joe, 6, {from: joe, value: fee});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not accept a rating of below -5", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.rate(joe, -6, {from: joe, value: fee});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not accept a rating with a low fee", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.rate(joe, -6, {from: joe, value: parseInt(fee - (fee * 0.5))});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not accept a rating with no fee", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.rate(joe, -6, {from: joe});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not allow draining from a non-manager account", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.drain({from: joe});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not allow manager to be set from a non-manager account", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.setManager(mary, {from: joe});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not allow back to back ratings", function() {

        var rep;

        return Etherep.deployed().then(function(instance) {

            rep = instance;

            // We'll want debug off for this test
            return rep.setDebug(false, {from: manager});

        })
        .then(function(trans) {
            return rep.rate(joe, 3, {from: sam, value: fee});
        })
        .then(function(trans) {
            return rep.rate(joe, 3, {from: sam, value: fee});
        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not allow an unprivileged user to change the delay", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.setDelay(60, {from: joe});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

    it("should not allow an unprivileged user to change the fee", function() {

        return Etherep.deployed().then(function(rep) {

            return rep.setFee(fee, {from: joe});

        })
        .then(assert.fail)
        .catch(function(err) {
            assert(err.message.indexOf('invalid opcode') >= 0, err);
        });

    });

});