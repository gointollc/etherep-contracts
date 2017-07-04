pragma solidity ^0.4.11;

import "./ratingstore.sol";

/** Ethereum Reputation

    Contract that takes ratings and calculates a reputation score
 */
contract Etherep {

    bool internal debug;
    address internal manager;
    uint internal fee;
    address internal storageAddress;
    uint internal waitTime;
    mapping (address => uint) internal lastRating;

    /// Events
    event Debug(string message);

    /**
     * Only a certain address can use this modified method
     * @param by The address that can use the method
     */
    modifier onlyBy(address by) { 
        if (msg.sender != by) {
            if (debug) Debug("Denied");
            throw; 
        }
        _; 
    }

    /**
     * Delay ratings to be at least waitTime apart
     */
    modifier delay() {
        if (lastRating[msg.sender] > now - waitTime) {
            if (debug) Debug("Rating too often");
            throw;
        }
        _;
    }

    /**
     * Require the minimum fee to be met
     */
    modifier requireFee() {
        if (msg.value < fee) {
            if (debug) Debug("Fee required");
            throw;
        }
        _;
    }

    /** 
     * Constructor
     * @param _manager The key that can make changes to this contract
     * @param _fee The variable fee that will be charged per rating
     * @param _storageAddress The address to the storage contract
     * @param _wait The minimum time in seconds a user has to wait between ratings
     */
    function Etherep(address _manager, uint _fee, address _storageAddress, uint _wait) {
        manager = _manager;
        fee = _fee;
        storageAddress = _storageAddress;
        waitTime = _wait;
        debug = false;
    }

    /**
     * Change the manager
     * @param who The address of the new manager
     * @return manager The address of this contract's manager
     */
    function setManager(address who) external onlyBy(manager) returns (address manager) {
        manager = who;
    }

    /**
     * Drain fees
     */
    function drain() external onlyBy(manager) {
        require(this.balance > 0);
        manager.transfer(this.balance);
    }

    /** 
     * Adds a rating to an address' cumulative score
     * @param who The address that is being rated
     * @param rating The rating(0-10)
     * @return success If the rating was processed successfully
     */
    function rate(address who, uint8 rating) external payable delay requireFee {

        if (rating > 5) {
            if (debug) Debug("Rating out of bounds");
            throw;
        }

        RatingStore store = RatingStore(storageAddress);

        // Multiply by 100 so we have a couple decimal places to work with
        uint workRating = rating * 100;

        // Get details on sender if available
        uint senderScore;
        uint senderRatings;
        (senderScore, senderRatings) = store.get(msg.sender);

        // If they have a score, we'll want to weight it
        if (senderScore != 0) {

            // Calculate their cumulative score
            uint senderCumulative = senderScore / (senderRatings * 100);

            // Calculate the weighted rating
            workRating = (workRating + senderCumulative) / 5;
        }

        // Add the new rating to their score
        store.add(who, workRating);

    }

    /**
     * Returns the cumulative score for an address
     * @param who The address to lookup
     * @return score The cumulative score
     */
    function getScore(address who) external constant returns (uint score) {

        RatingStore store = RatingStore(storageAddress);
        
        uint cumulative;
        uint ratings;
        (cumulative, ratings) = store.get(who);

        // The score should have room for 2 decimal places, but ratings is a 
        // single count
        score = cumulative / (ratings * 100);

    }

}