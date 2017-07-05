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
    event DebugInt(int message);
    event DebugUint(uint message);
    event Rating(
        address by, 
        address who, 
        int rating
    );

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
    function rate(address who, int rating) external payable delay requireFee {

        if (rating > 5 || rating < -5) {
            if (debug) Debug("Out of bounds");
            throw;
        }
        if (who == msg.sender) {
            if (debug) Debug("Self rating");
            throw;
        }

        RatingStore store = RatingStore(storageAddress);
        
        // Starting weight
        int weight = 0;

        // Rating multiplier
        int multiplier = 100;

        // We need the absolute value
        int absRating = rating;
        if (absRating < 0) {
            absRating = -rating;
        }

        // Get details on sender if available
        int senderScore;
        uint senderRatings;
        int senderCumulative = 0;
        (senderScore, senderRatings) = store.get(msg.sender);

        // Calculate cumulative score if available
        if (senderScore != 0) {
            senderCumulative = (senderScore / (int(senderRatings) * 100)) * 100;
        }

        // Calculate the weight if the sender is rated above 0
        if (senderCumulative > 0) {
            weight = (((senderCumulative / 5) * absRating) / 10) + multiplier;
        }
        // Otherwise, unweighted
        else {
            weight = multiplier;
        }
        
        // Calculate weighted rating
        int workRating = rating * weight;

        Rating(msg.sender, who, workRating);

        // Add the new rating to their score
        store.add(who, workRating);

    }

    /**
     * Returns the cumulative score for an address
     * @param who The address to lookup
     * @return score The cumulative score
     */
    function getScore(address who) external constant returns (int score) {

        RatingStore store = RatingStore(storageAddress);
        
        int cumulative;
        uint ratings;
        (cumulative, ratings) = store.get(who);
        DebugInt(cumulative);
        Debug("Cumulative");
        // The score should have room for 2 decimal places, but ratings is a 
        // single count
        score = cumulative / int(ratings);

    }

}