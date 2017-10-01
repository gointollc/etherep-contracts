pragma solidity ^0.4.11;

/*  Copyright 2017 GoInto, LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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
    event Error(
        address sender,
        string message
    );
    event Debug(string message);
    event DebugInt(int message);
    event DebugUint(uint message);
    event Rating(
        address by, 
        address who, 
        int rating
    );
    event FeeChanged(uint f);
    event DelayChanged(uint d);

    /**
     * Only a certain address can use this modified method
     * @param by The address that can use the method
     */
    modifier onlyBy(address by) { 
        require(msg.sender == by);
        _; 
    }

    /**
     * Delay ratings to be at least waitTime apart
     */
    modifier delay() {
        if (debug == false && lastRating[msg.sender] > now - waitTime) {
            Error(msg.sender, "Rating too often");
            revert();
        }
        _;
    }

    /**
     * Require the minimum fee to be met
     */
    modifier requireFee() {
        require(msg.value >= fee);
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
     * Set debug
     * @param d The debug value that should be set
     */
    function setDebug(bool d) external onlyBy(manager) {
        debug = d;
    }

    /**
     * Get debug
     * @return debug
     */
    function getDebug() external constant returns (bool) {
        return debug;
    }

    /**
     * Change the fee
     * @param newFee New rating fee in Wei
     */
    function setFee(uint newFee) external onlyBy(manager) {
        fee = newFee;
        FeeChanged(fee);
    }

    /**
     * Get the fee
     * @return fee The current fee in Wei
     */
    function getFee() external constant returns (uint) {
        return fee;
    }

    /**
     * Change the rating delay
     * @param _delay Delay in seconds
     */
    function setDelay(uint _delay) external onlyBy(manager) {
        waitTime = _delay;
        DelayChanged(waitTime);
    }

    /**
     * Get the delay time
     * @return delay The current rating delay time in seconds
     */
    function getDelay() external constant returns (uint) {
        return waitTime;
    }

    /**
     * Change the manager
     * @param who The address of the new manager
     */
    function setManager(address who) external onlyBy(manager) {
        manager = who;
    }

    /**
     * Get the manager
     * @return manager The address of this contract's manager
     */
    function getManager() external constant returns (address) {
        return manager;
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
     * @param rating The rating(-5 to 5)
     * @return success If the rating was processed successfully
     */
    function rate(address who, int rating) external payable delay requireFee {

        require(rating <= 5 && rating >= -5);
        require(who != msg.sender);

        RatingStore store = RatingStore(storageAddress);
        
        // Standard weight
        int weight = 0;

        // Convert rating into a fake-float
        int workRating = rating * 100;

        // We need the absolute value
        int absRating;
        if (rating >= 0) {
            absRating = workRating;
        } else {
            absRating = -workRating;
        }

        // Get details on sender if available
        int senderScore;
        uint senderRatings;
        int senderCumulative = 0;
        (senderScore, senderRatings) = store.get(msg.sender);

        // Calculate cumulative score if available for use in weighting. We're 
        // acting as-if the two right-most places are decimals
        if (senderScore != 0) {
            senderCumulative = (senderScore / (int(senderRatings) * 100)) * 100;
        }

        // Calculate the weight if the sender has a positive rating
        if (senderCumulative > 0 && absRating != 0) {

            // Getting a weight to add to the final rating calculation.  Only 
            // raters who have a positive cumulative score with have any extra 
            // weight.  Final weight should be between 40 and 100 and scale down
            // depending on how strong the rating is.
            weight = (senderCumulative + absRating) / 10;

            // We need the final weight to be signed the same as the rating
            if (rating < 0) {
                weight = -weight;
            }

        }
        
        // Add the weight to the rating
        workRating += weight;

        // Set last rating timestamp
        lastRating[msg.sender] = now;

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
        
        // The score should have room for 2 decimal places, but ratings is a 
        // single count
        score = cumulative / int(ratings);

    }

    /**
     * Returns the cumulative score and count of ratings for an address
     * @param who The address to lookup
     * @return score The cumulative score
     * @return count How many ratings have been made
     */
    function getScoreAndCount(address who) external constant returns (int score, uint ratings) {

        RatingStore store = RatingStore(storageAddress);
        
        int cumulative;
        (cumulative, ratings) = store.get(who);
        
        // The score should have room for 2 decimal places, but ratings is a 
        // single count
        score = cumulative / int(ratings);

    }

}