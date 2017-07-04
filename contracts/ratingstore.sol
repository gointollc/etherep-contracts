pragma solidity ^0.4.11;

/**
 * Storage contract for Etherep to store ratings and score data.  It's been 
 * separated from the main contract because this is much less likely to change
 * than the other parts.  It would allow for upgrading the main contract without
 * losing data.
 */
contract RatingStore {

    struct Score {
        bool exists;
        uint cumulativeScore;
        uint totalRatings;
    }

    bool internal debug;
    mapping (address => Score) internal scores;
    // The manager with full access
    address internal manager;
    // The contract that has write accees
    address internal controller;

    /// Events
    event Debug(string message);

    /**
     * Only the manager or controller can use this method
     */
    modifier restricted() { 
        if (msg.sender != manager && tx.origin != manager && msg.sender != controller) {
            throw; 
        }
        _; 
    }

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
     * Constructor
     * @param _manager The address that has full access to the contract
     * @param _controller The contract that can make write calls to this contract
     */
    function RatingStore(address _manager, address _controller) {
        manager = _manager;
        controller = _controller;
        debug = false;
    }

    /**
     * Set a Score
     * @param target The address' score we're setting
     * @param cumulative The cumulative score for the address
     * @param total Total individual ratings for the address
     * @return success If the set was completed successfully
     */
    function set(address target, uint cumulative, uint total) external restricted {
        if (!scores[target].exists) {
            scores[target] = Score(true, 0, 0);
        }
        scores[target].cumulativeScore = cumulative;
        scores[target].totalRatings = total;
    }

    /**
     * Add a rating
     * @param target The address' score we're adding to
     * @param wScore The weighted rating to add to the score
     * @return success
     */
    function add(address target, uint wScore) external restricted {
        if (!scores[target].exists) {
            scores[target] = Score(true, 0, 0);
        }
        scores[target].cumulativeScore += wScore;
        scores[target].totalRatings += 1;
    }

    /**
     * Get the score for an address
     * @param target The address' score to return
     * @return cumulative score
     * @return total ratings
     */
    function get(address target) external constant returns (uint, uint) {
        return (scores[target].cumulativeScore, scores[target].totalRatings);
    }

    /**
     * Reset an entire score storage
     * @param target The address we're wiping clean
     */
    function reset(address target) external onlyBy(manager) {
        scores[target] = Score(true, 0,0);
    }

    /**
     * Return the manager
     * @return address The manager address
     */
    function getManager() external constant returns (address) {
        return manager;
    }

    /**
     * Change the manager
     * @param newManager The address we're setting as manager
     */
    function setManager(address newManager) external onlyBy(manager) {
        manager = newManager;
    }

    /**
     * Return the controller
     * @return address The manager address
     */
    function getController() external constant returns (address) {
        return controller;
    }

    /**
     * Change the controller
     * @param newController The address we're setting as controller
     */
    function setController(address newController) external onlyBy(manager) {
        controller = newController;
    }

    /**
     * Return the debug setting
     * @return bool debug
     */
    function getDebug() external constant returns (bool) {
        return debug;
    }

    /**
     * Set debug
     * @param _debug The bool value debug should be set to
     */
    function setDebug(bool _debug) external onlyBy(manager) {
        debug = _debug;
    }

}