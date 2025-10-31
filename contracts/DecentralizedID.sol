// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DecentralizedID
 * @notice A gas and space efficient decentralized identity and attestation platform
 * @dev Admin can whitelist companies, companies can create schemas and issue attestations
 */
contract DecentralizedID {
    // ==================== State Variables ====================
    
    address public admin;
    
    // Mapping to check if an address is a whitelisted company
    mapping(address => bool) public isWhitelistedCompany;
    
    // Mapping to check if an address is a company (includes removed ones for history)
    mapping(address => CompanyInfo) public companies;
    
    // Schema ID => Schema Info (company address + schema metadata)
    mapping(uint256 => Schema) public schemas;
    uint256 public nextSchemaId;
    
    // Attestation ID => Attestation Info
    mapping(uint256 => Attestation) public attestations;
    uint256 public nextAttestationId;
    
    // User address => Attestation IDs array
    mapping(address => uint256[]) public userAttestations;
    
    // Company address => Schema IDs they created
    mapping(address => uint256[]) public companySchemas;
    
    // Company address => Attestation IDs they issued
    mapping(address => uint256[]) public companyAttestations;
    
    // Schema ID => Attestation IDs issued for this schema
    mapping(uint256 => uint256[]) public schemaAttestations;
    
    // ==================== Structs ====================
    
    struct CompanyInfo {
        bool isActive;
        uint256 addedAt;
        string metadata; // IPFS hash or JSON string for company info
    }
    
    struct Schema {
        address company;
        string name;
        string description;
        string schemaDefinition; // JSON schema or IPFS hash
        uint256 createdAt;
        bool isActive;
    }
    
    struct Attestation {
        address recipient; // User who received the attestation
        address issuer; // Company that issued it
        uint256 schemaId;
        string data; // Attestation data (IPFS hash or JSON)
        uint256 issuedAt;
        uint256 expiresAt; // 0 means never expires
        bool isRevoked;
        string revocationReason; // Empty if not revoked
    }
    
    // ==================== Events ====================
    
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event CompanyWhitelisted(address indexed company, string metadata);
    event CompanyRemoved(address indexed company);
    event SchemaCreated(
        uint256 indexed schemaId,
        address indexed company,
        string name,
        string description
    );
    event SchemaUpdated(uint256 indexed schemaId, bool isActive);
    event AttestationIssued(
        uint256 indexed attestationId,
        address indexed recipient,
        address indexed issuer,
        uint256 schemaId
    );
    event AttestationRevoked(
        uint256 indexed attestationId,
        address indexed issuer,
        string reason
    );
    
    // ==================== Modifiers ====================
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "DecentralizedID: Only admin");
        _;
    }
    
    modifier onlyWhitelistedCompany() {
        require(
            isWhitelistedCompany[msg.sender],
            "DecentralizedID: Only whitelisted companies"
        );
        _;
    }
    
    modifier validSchema(uint256 schemaId) {
        require(schemaId < nextSchemaId, "DecentralizedID: Invalid schema ID");
        require(schemas[schemaId].isActive, "DecentralizedID: Schema not active");
        require(
            schemas[schemaId].company == msg.sender,
            "DecentralizedID: Schema belongs to another company"
        );
        _;
    }
    
    modifier validAttestation(uint256 attestationId) {
        require(
            attestationId < nextAttestationId,
            "DecentralizedID: Invalid attestation ID"
        );
        _;
    }
    
    // ==================== Constructor ====================
    
    constructor() {
        admin = msg.sender;
        nextSchemaId = 1;
        nextAttestationId = 1;
    }
    
    // ==================== Admin Functions ====================
    
    /**
     * @notice Change the admin address
     * @param newAdmin Address of the new admin
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "DecentralizedID: Invalid admin address");
        require(newAdmin != admin, "DecentralizedID: Same admin");
        
        address oldAdmin = admin;
        admin = newAdmin;
        
        emit AdminChanged(oldAdmin, newAdmin);
    }
    
    /**
     * @notice Add a new company to the whitelist
     * @param company Address of the company to whitelist
     * @param metadata Company metadata (IPFS hash or JSON string)
     */
    function addWhitelistedCompany(
        address company,
        string memory metadata
    ) external onlyAdmin {
        require(company != address(0), "DecentralizedID: Invalid company address");
        require(
            !isWhitelistedCompany[company],
            "DecentralizedID: Company already whitelisted"
        );
        
        isWhitelistedCompany[company] = true;
        companies[company] = CompanyInfo({
            isActive: true,
            addedAt: block.timestamp,
            metadata: metadata
        });
        
        emit CompanyWhitelisted(company, metadata);
    }
    
    /**
     * @notice Remove a company from the whitelist
     * @param company Address of the company to remove
     */
    function removeWhitelistedCompany(address company) external onlyAdmin {
        require(
            isWhitelistedCompany[company],
            "DecentralizedID: Company not whitelisted"
        );
        
        isWhitelistedCompany[company] = false;
        companies[company].isActive = false;
        
        emit CompanyRemoved(company);
    }
    
    /**
     * @notice Batch add multiple companies at once (gas efficient)
     * @param companyAddresses Array of company addresses
     * @param metadataArray Array of metadata strings (same length as companies)
     */
    function batchAddCompanies(
        address[] memory companyAddresses,
        string[] memory metadataArray
    ) external onlyAdmin {
        require(
            companyAddresses.length == metadataArray.length,
            "DecentralizedID: Arrays length mismatch"
        );
        require(companyAddresses.length > 0, "DecentralizedID: Empty arrays");
        
        for (uint256 i = 0; i < companyAddresses.length; i++) {
            if (companyAddresses[i] != address(0) && !isWhitelistedCompany[companyAddresses[i]]) {
                isWhitelistedCompany[companyAddresses[i]] = true;
                companies[companyAddresses[i]] = CompanyInfo({
                    isActive: true,
                    addedAt: block.timestamp,
                    metadata: metadataArray[i]
                });
                
                emit CompanyWhitelisted(companyAddresses[i], metadataArray[i]);
            }
        }
    }
    
    // ==================== Company Functions ====================
    
    /**
     * @notice Create a new schema for attestations
     * @param name Name of the schema
     * @param description Description of the schema
     * @param schemaDefinition JSON schema definition or IPFS hash
     * @return schemaId The ID of the newly created schema
     */
    function createSchema(
        string memory name,
        string memory description,
        string memory schemaDefinition
    ) external onlyWhitelistedCompany returns (uint256 schemaId) {
        require(bytes(name).length > 0, "DecentralizedID: Name cannot be empty");
        
        schemaId = nextSchemaId++;
        
        schemas[schemaId] = Schema({
            company: msg.sender,
            name: name,
            description: description,
            schemaDefinition: schemaDefinition,
            createdAt: block.timestamp,
            isActive: true
        });
        
        companySchemas[msg.sender].push(schemaId);
        
        emit SchemaCreated(schemaId, msg.sender, name, description);
    }
    
    /**
     * @notice Update schema active status (only schema owner can update)
     * @param schemaId ID of the schema to update
     * @param isActive New active status
     */
    function updateSchemaStatus(
        uint256 schemaId,
        bool isActive
    ) external validSchema(schemaId) {
        schemas[schemaId].isActive = isActive;
        
        emit SchemaUpdated(schemaId, isActive);
    }
    
    /**
     * @notice Issue an attestation to a user
     * @param recipient Address of the user receiving the attestation
     * @param schemaId ID of the schema this attestation follows
     * @param data Attestation data (IPFS hash or JSON string)
     * @param expiresAt Expiration timestamp (0 means never expires)
     * @return attestationId The ID of the newly created attestation
     */
    function issueAttestation(
        address recipient,
        uint256 schemaId,
        string memory data,
        uint256 expiresAt
    ) external onlyWhitelistedCompany returns (uint256 attestationId) {
        require(recipient != address(0), "DecentralizedID: Invalid recipient");
        require(schemaId < nextSchemaId, "DecentralizedID: Invalid schema ID");
        require(schemas[schemaId].isActive, "DecentralizedID: Schema not active");
        require(
            schemas[schemaId].company == msg.sender,
            "DecentralizedID: Schema belongs to another company"
        );
        require(
            expiresAt == 0 || expiresAt > block.timestamp,
            "DecentralizedID: Invalid expiration time"
        );
        
        attestationId = nextAttestationId++;
        
        attestations[attestationId] = Attestation({
            recipient: recipient,
            issuer: msg.sender,
            schemaId: schemaId,
            data: data,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            isRevoked: false,
            revocationReason: ""
        });
        
        userAttestations[recipient].push(attestationId);
        companyAttestations[msg.sender].push(attestationId);
        schemaAttestations[schemaId].push(attestationId);
        
        emit AttestationIssued(attestationId, recipient, msg.sender, schemaId);
    }
    
    /**
     * @notice Batch issue multiple attestations (gas efficient)
     * @param recipients Array of recipient addresses
     * @param schemaIds Array of schema IDs
     * @param dataArray Array of data strings
     * @param expiresAtArray Array of expiration timestamps
     * @return attestationIds Array of created attestation IDs
     */
    function batchIssueAttestations(
        address[] memory recipients,
        uint256[] memory schemaIds,
        string[] memory dataArray,
        uint256[] memory expiresAtArray
    ) external onlyWhitelistedCompany returns (uint256[] memory attestationIds) {
        require(
            recipients.length == schemaIds.length &&
            schemaIds.length == dataArray.length &&
            dataArray.length == expiresAtArray.length,
            "DecentralizedID: Arrays length mismatch"
        );
        require(recipients.length > 0, "DecentralizedID: Empty arrays");
        
        attestationIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            if (
                recipients[i] != address(0) &&
                schemaIds[i] < nextSchemaId &&
                schemas[schemaIds[i]].isActive &&
                schemas[schemaIds[i]].company == msg.sender &&
                (expiresAtArray[i] == 0 || expiresAtArray[i] > block.timestamp)
            ) {
                uint256 attestationId = nextAttestationId++;
                
                attestations[attestationId] = Attestation({
                    recipient: recipients[i],
                    issuer: msg.sender,
                    schemaId: schemaIds[i],
                    data: dataArray[i],
                    issuedAt: block.timestamp,
                    expiresAt: expiresAtArray[i],
                    isRevoked: false,
                    revocationReason: ""
                });
                
                userAttestations[recipients[i]].push(attestationId);
                companyAttestations[msg.sender].push(attestationId);
                schemaAttestations[schemaIds[i]].push(attestationId);
                
                attestationIds[i] = attestationId;
                
                emit AttestationIssued(
                    attestationId,
                    recipients[i],
                    msg.sender,
                    schemaIds[i]
                );
            }
        }
    }
    
    /**
     * @notice Revoke an attestation
     * @param attestationId ID of the attestation to revoke
     * @param reason Reason for revocation
     */
    function revokeAttestation(
        uint256 attestationId,
        string memory reason
    ) external validAttestation(attestationId) {
        Attestation storage attestation = attestations[attestationId];
        
        require(
            attestation.issuer == msg.sender,
            "DecentralizedID: Only issuer can revoke"
        );
        require(!attestation.isRevoked, "DecentralizedID: Already revoked");
        
        attestation.isRevoked = true;
        attestation.revocationReason = reason;
        
        emit AttestationRevoked(attestationId, msg.sender, reason);
    }
    
    /**
     * @notice Batch revoke multiple attestations
     * @param attestationIds Array of attestation IDs to revoke
     * @param reasons Array of revocation reasons
     */
    function batchRevokeAttestations(
        uint256[] memory attestationIds,
        string[] memory reasons
    ) external onlyWhitelistedCompany {
        require(
            attestationIds.length == reasons.length,
            "DecentralizedID: Arrays length mismatch"
        );
        require(attestationIds.length > 0, "DecentralizedID: Empty arrays");
        
        for (uint256 i = 0; i < attestationIds.length; i++) {
            if (
                attestationIds[i] < nextAttestationId &&
                attestations[attestationIds[i]].issuer == msg.sender &&
                !attestations[attestationIds[i]].isRevoked
            ) {
                attestations[attestationIds[i]].isRevoked = true;
                attestations[attestationIds[i]].revocationReason = reasons[i];
                
                emit AttestationRevoked(attestationIds[i], msg.sender, reasons[i]);
            }
        }
    }
    
    // ==================== View Functions ====================
    
    /**
     * @notice Get a single attestation by ID
     * @param attestationId ID of the attestation
     * @return attestation The attestation struct
     */
    function getAttestation(
        uint256 attestationId
    ) external view validAttestation(attestationId) returns (Attestation memory) {
        return attestations[attestationId];
    }
    
    /**
     * @notice Get all attestation IDs for a user
     * @param user Address of the user
     * @return Array of attestation IDs
     */
    function getUserAttestationIds(
        address user
    ) external view returns (uint256[] memory) {
        return userAttestations[user];
    }
    
    /**
     * @notice Get all attestations for a user (with details)
     * @param user Address of the user
     * @return Array of attestation structs
     */
    function getUserAttestations(
        address user
    ) external view returns (Attestation[] memory) {
        uint256[] memory attestationIds = userAttestations[user];
        Attestation[] memory userAtts = new Attestation[](attestationIds.length);
        
        for (uint256 i = 0; i < attestationIds.length; i++) {
            userAtts[i] = attestations[attestationIds[i]];
        }
        
        return userAtts;
    }
    
    /**
     * @notice Get all active (non-revoked, non-expired) attestations for a user
     * @param user Address of the user
     * @return Array of attestation structs
     */
    function getActiveUserAttestations(
        address user
    ) external view returns (Attestation[] memory) {
        uint256[] memory attestationIds = userAttestations[user];
        
        // First pass: count active attestations
        uint256 activeCount = 0;
        for (uint256 i = 0; i < attestationIds.length; i++) {
            Attestation memory att = attestations[attestationIds[i]];
            if (
                !att.isRevoked &&
                (att.expiresAt == 0 || att.expiresAt > block.timestamp)
            ) {
                activeCount++;
            }
        }
        
        // Second pass: collect active attestations
        Attestation[] memory activeAtts = new Attestation[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < attestationIds.length; i++) {
            Attestation memory att = attestations[attestationIds[i]];
            if (
                !att.isRevoked &&
                (att.expiresAt == 0 || att.expiresAt > block.timestamp)
            ) {
                activeAtts[index] = att;
                index++;
            }
        }
        
        return activeAtts;
    }
    
    /**
     * @notice Get schema information
     * @param schemaId ID of the schema
     * @return Schema struct
     */
    function getSchema(
        uint256 schemaId
    ) external view returns (Schema memory) {
        require(schemaId < nextSchemaId, "DecentralizedID: Invalid schema ID");
        return schemas[schemaId];
    }
    
    /**
     * @notice Get all schemas created by a company
     * @param company Address of the company
     * @return Array of schema structs
     */
    function getCompanySchemas(
        address company
    ) external view returns (Schema[] memory) {
        uint256[] memory schemaIds = companySchemas[company];
        Schema[] memory schemasList = new Schema[](schemaIds.length);
        
        for (uint256 i = 0; i < schemaIds.length; i++) {
            schemasList[i] = schemas[schemaIds[i]];
        }
        
        return schemasList;
    }
    
    /**
     * @notice Get all attestations issued by a company
     * @param company Address of the company
     * @return Array of attestation structs
     */
    function getCompanyAttestations(
        address company
    ) external view returns (Attestation[] memory) {
        uint256[] memory attestationIds = companyAttestations[company];
        Attestation[] memory companyAtts = new Attestation[](attestationIds.length);
        
        for (uint256 i = 0; i < attestationIds.length; i++) {
            companyAtts[i] = attestations[attestationIds[i]];
        }
        
        return companyAtts;
    }
    
    /**
     * @notice Get all attestations for a specific schema
     * @param schemaId ID of the schema
     * @return Array of attestation structs
     */
    function getSchemaAttestations(
        uint256 schemaId
    ) external view returns (Attestation[] memory) {
        require(schemaId < nextSchemaId, "DecentralizedID: Invalid schema ID");
        
        uint256[] memory attestationIds = schemaAttestations[schemaId];
        Attestation[] memory schemaAtts = new Attestation[](attestationIds.length);
        
        for (uint256 i = 0; i < attestationIds.length; i++) {
            schemaAtts[i] = attestations[attestationIds[i]];
        }
        
        return schemaAtts;
    }
    
    /**
     * @notice Check if an attestation is valid (not revoked and not expired)
     * @param attestationId ID of the attestation
     * @return isValid True if attestation is valid
     */
    function isAttestationValid(
        uint256 attestationId
    ) external view validAttestation(attestationId) returns (bool) {
        Attestation memory att = attestations[attestationId];
        return !att.isRevoked &&
            (att.expiresAt == 0 || att.expiresAt > block.timestamp);
    }
    
    /**
     * @notice Get total number of attestations for a user
     * @param user Address of the user
     * @return count Number of attestations
     */
    function getUserAttestationCount(address user) external view returns (uint256) {
        return userAttestations[user].length;
    }
    
    /**
     * @notice Get company information
     * @param company Address of the company
     * @return CompanyInfo struct
     */
    function getCompanyInfo(
        address company
    ) external view returns (CompanyInfo memory) {
        return companies[company];
    }
}

