// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DigitalID
 * @dev Smart contract for managing digital identities on the blockchain
 * @author RakshaSetu Team
 */
contract DigitalID {
    // Owner of the contract
    address public owner;
    
    // Counter for identity IDs
    uint256 private _idCounter;
    
    // Struct to store digital identity information
    struct Identity {
        uint256 id;
        string name;
        string email;
        string nationality;
        string aadhaarHash; // Hash of Aadhaar number for privacy
        string passportHash; // Hash of passport number for privacy
        string emergencyContact;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
        bool isVerified;
        address walletAddress;
        string[] roles; // Array of roles (tourist, police, tourism, admin)
    }
    
    // Mapping from wallet address to identity ID
    mapping(address => uint256) public walletToIdentity;
    
    // Mapping from identity ID to Identity struct
    mapping(uint256 => Identity) public identities;
    
    // Mapping from email to identity ID
    mapping(string => uint256) public emailToIdentity;
    
    // Mapping from Aadhaar hash to identity ID
    mapping(string => uint256) public aadhaarToIdentity;
    
    // Mapping from passport hash to identity ID
    mapping(string => uint256) public passportToIdentity;
    
    // Events
    event IdentityCreated(
        uint256 indexed id,
        address indexed walletAddress,
        string name,
        string email,
        uint256 timestamp
    );
    
    event IdentityUpdated(
        uint256 indexed id,
        address indexed walletAddress,
        uint256 timestamp
    );
    
    event IdentityVerified(
        uint256 indexed id,
        address indexed verifier,
        uint256 timestamp
    );
    
    event IdentityDeactivated(
        uint256 indexed id,
        address indexed walletAddress,
        uint256 timestamp
    );
    
    event RoleAdded(
        uint256 indexed id,
        string role,
        uint256 timestamp
    );
    
    event RoleRemoved(
        uint256 indexed id,
        string role,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyIdentityOwner(uint256 _id) {
        require(identities[_id].walletAddress == msg.sender, "Not identity owner");
        _;
    }
    
    modifier identityExists(uint256 _id) {
        require(identities[_id].walletAddress != address(0), "Identity does not exist");
        _;
    }
    
    modifier onlyVerifiedIdentity(uint256 _id) {
        require(identities[_id].isVerified, "Identity not verified");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        _idCounter = 0;
    }
    
    /**
     * @dev Create a new digital identity
     * @param _name Full name of the user
     * @param _email Email address
     * @param _nationality Nationality
     * @param _aadhaarHash Hash of Aadhaar number
     * @param _passportHash Hash of passport number
     * @param _emergencyContact Emergency contact information
     * @param _roles Array of roles
     */
    function createIdentity(
        string memory _name,
        string memory _email,
        string memory _nationality,
        string memory _aadhaarHash,
        string memory _passportHash,
        string memory _emergencyContact,
        string[] memory _roles
    ) external {
        require(walletToIdentity[msg.sender] == 0, "Identity already exists");
        require(emailToIdentity[_email] == 0, "Email already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        _idCounter++;
        uint256 newId = _idCounter;
        
        Identity storage newIdentity = identities[newId];
        newIdentity.id = newId;
        newIdentity.name = _name;
        newIdentity.email = _email;
        newIdentity.nationality = _nationality;
        newIdentity.aadhaarHash = _aadhaarHash;
        newIdentity.passportHash = _passportHash;
        newIdentity.emergencyContact = _emergencyContact;
        newIdentity.createdAt = block.timestamp;
        newIdentity.updatedAt = block.timestamp;
        newIdentity.isActive = true;
        newIdentity.isVerified = false;
        newIdentity.walletAddress = msg.sender;
        
        // Add roles
        for (uint256 i = 0; i < _roles.length; i++) {
            newIdentity.roles.push(_roles[i]);
        }
        
        // Update mappings
        walletToIdentity[msg.sender] = newId;
        emailToIdentity[_email] = newId;
        
        if (bytes(_aadhaarHash).length > 0) {
            aadhaarToIdentity[_aadhaarHash] = newId;
        }
        
        if (bytes(_passportHash).length > 0) {
            passportToIdentity[_passportHash] = newId;
        }
        
        emit IdentityCreated(newId, msg.sender, _name, _email, block.timestamp);
    }
    
    /**
     * @dev Update identity information
     * @param _id Identity ID
     * @param _name Updated name
     * @param _email Updated email
     * @param _nationality Updated nationality
     * @param _emergencyContact Updated emergency contact
     */
    function updateIdentity(
        uint256 _id,
        string memory _name,
        string memory _email,
        string memory _nationality,
        string memory _emergencyContact
    ) external onlyIdentityOwner(_id) identityExists(_id) {
        Identity storage identity = identities[_id];
        
        // Check if email is not already taken by another identity
        if (keccak256(bytes(identity.email)) != keccak256(bytes(_email))) {
            require(emailToIdentity[_email] == 0, "Email already registered");
            emailToIdentity[identity.email] = 0; // Remove old email mapping
            emailToIdentity[_email] = _id; // Add new email mapping
        }
        
        identity.name = _name;
        identity.email = _email;
        identity.nationality = _nationality;
        identity.emergencyContact = _emergencyContact;
        identity.updatedAt = block.timestamp;
        
        emit IdentityUpdated(_id, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify an identity (only owner can call this)
     * @param _id Identity ID to verify
     */
    function verifyIdentity(uint256 _id) external onlyOwner identityExists(_id) {
        identities[_id].isVerified = true;
        emit IdentityVerified(_id, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Deactivate an identity
     * @param _id Identity ID to deactivate
     */
    function deactivateIdentity(uint256 _id) external onlyIdentityOwner(_id) identityExists(_id) {
        identities[_id].isActive = false;
        emit IdentityDeactivated(_id, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add a role to an identity
     * @param _id Identity ID
     * @param _role Role to add
     */
    function addRole(uint256 _id, string memory _role) external onlyIdentityOwner(_id) identityExists(_id) {
        identities[_id].roles.push(_role);
        emit RoleAdded(_id, _role, block.timestamp);
    }
    
    /**
     * @dev Remove a role from an identity
     * @param _id Identity ID
     * @param _roleIndex Index of role to remove
     */
    function removeRole(uint256 _id, uint256 _roleIndex) external onlyIdentityOwner(_id) identityExists(_id) {
        require(_roleIndex < identities[_id].roles.length, "Invalid role index");
        
        // Move last element to the position of the element to delete
        identities[_id].roles[_roleIndex] = identities[_id].roles[identities[_id].roles.length - 1];
        identities[_id].roles.pop();
        
        emit RoleRemoved(_id, identities[_id].roles[_roleIndex], block.timestamp);
    }
    
    /**
     * @dev Get identity by wallet address
     * @param _walletAddress Wallet address
     * @return Identity struct
     */
    function getIdentityByWallet(address _walletAddress) external view returns (Identity memory) {
        uint256 id = walletToIdentity[_walletAddress];
        require(id != 0, "Identity not found");
        return identities[id];
    }
    
    /**
     * @dev Get identity by ID
     * @param _id Identity ID
     * @return Identity struct
     */
    function getIdentityById(uint256 _id) external view identityExists(_id) returns (Identity memory) {
        return identities[_id];
    }
    
    /**
     * @dev Check if wallet has an identity
     * @param _walletAddress Wallet address
     * @return True if identity exists
     */
    function hasIdentity(address _walletAddress) external view returns (bool) {
        return walletToIdentity[_walletAddress] != 0;
    }
    
    /**
     * @dev Get total number of identities
     * @return Total count
     */
    function getTotalIdentities() external view returns (uint256) {
        return _idCounter;
    }
    
    /**
     * @dev Get identity roles
     * @param _id Identity ID
     * @return Array of roles
     */
    function getIdentityRoles(uint256 _id) external view identityExists(_id) returns (string[] memory) {
        return identities[_id].roles;
    }
    
    /**
     * @dev Check if identity has specific role
     * @param _id Identity ID
     * @param _role Role to check
     * @return True if identity has the role
     */
    function hasRole(uint256 _id, string memory _role) external view identityExists(_id) returns (bool) {
        string[] memory roles = identities[_id].roles;
        for (uint256 i = 0; i < roles.length; i++) {
            if (keccak256(bytes(roles[i])) == keccak256(bytes(_role))) {
                return true;
            }
        }
        return false;
    }
}