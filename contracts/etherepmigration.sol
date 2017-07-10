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

/** etherep migration tracker

    Tracks the locations of ehterep and its libraries should the need arise for 
    a migration
 */
contract EtherepMigration {

    struct Manager {
        bool isAdmin;
        bool isManager;
        address addedBy;
    }

    mapping (address => Manager) managers;
    mapping (string => address) contracts;

    event EventSetContract(address by, string key, address contractAddress);
    event EventAddAdmin(address by, address admin);
    event EventRemoveAdmin(address by, address admin);
    event EventAddManager(address by, address manager);
    event EventRemoveManager(address by, address manager);

    /**
     * Only admins can execute
     */
    modifier onlyAdmin() { 
        if (managers[msg.sender].isAdmin != true) {
            throw; 
        }
        _; 
    }

    /**
     * Only managers can execute
     */
    modifier onlyManager() { 
        if (managers[msg.sender].isManager != true) {
            throw; 
        }
        _; 
    }

    function EtherepMigration(address originalAdmin) {
        managers[originalAdmin] = Manager(true, true, msg.sender);
    }

    /**
     * Set a contract location by key
     * @param key - The string key to be used for lookup.  e.g. 'etherep'
     * @param contractAddress - The address of the contract
     */
    function setContract(string key, address contractAddress) external onlyManager {

        // Set
        contracts[key] = contractAddress;

        // Send event notification
        EventSetContract(msg.sender, key, contractAddress);

    }

    /**
     * Get a contract location by key
     * @param key - The string key to be used for lookup.  e.g. 'etherep'
     * @return contractAddress - The address of the contract
     */
    function getContract(string key) external constant returns (address) {

        // Set
        return contracts[key];

    }

    /**
     * Get permissions of an address
     * @param who - The address to check
     * @return isAdmin - Is this address an admin?
     * @return isManager - Is this address a manager?
     */
    function getPermissions(address who) external constant returns (bool, bool) {
        return (managers[who].isAdmin, managers[who].isManager);
    }

    /**
     * Add an admin
     * @param adminAddress - The address of the admin
     */
    function addAdmin(address adminAddress) external onlyAdmin {

        // Set
        managers[adminAddress] = Manager(true, true, msg.sender);

        // Send event notification
        EventAddAdmin(msg.sender, adminAddress);

    }

    /**
     * Remove an admin
     * @param adminAddress - The address of the admin
     */
    function removeAdmin(address adminAddress) external onlyAdmin {

        // Let's make sure we have at least one admin
        if (adminAddress == msg.sender) {
            throw;
        }

        // Set
        managers[adminAddress] = Manager(false, false, msg.sender);

        // Send event notification
        EventRemoveAdmin(msg.sender, adminAddress);

    }

    /**
     * Add a manager
     * @param manAddress - The address of the new manager
     */
    function addManager(address manAddress) external onlyAdmin {

        // Set
        managers[manAddress] = Manager(false, true, msg.sender);

        // Send event notification
        EventAddManager(msg.sender, manAddress);

    }

    /**
     * Remove a manager
     * @param manAddress - The address of the new manager
     */
    function removeManager(address manAddress) external onlyAdmin {

        // Set
        managers[manAddress] = Manager(false, false, msg.sender);

        // Send event notification
        EventRemoveManager(msg.sender, manAddress);

    }

}