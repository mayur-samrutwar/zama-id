# Decentralized ID Smart Contract

A gas and space-efficient decentralized identity and attestation platform built on Ethereum.

## Features

### Admin Functions
- **Change Admin**: Transfer admin privileges to a new address
- **Add Whitelisted Company**: Grant a company permission to issue attestations
- **Remove Whitelisted Company**: Revoke a company's permission
- **Batch Add Companies**: Efficiently whitelist multiple companies at once

### Company Functions
- **Create Schema**: Define new attestation types with custom schemas
- **Update Schema Status**: Activate or deactivate schemas
- **Issue Attestation**: Issue attestations to users with optional expiration
- **Batch Issue Attestations**: Efficiently issue multiple attestations
- **Revoke Attestation**: Revoke previously issued attestations
- **Batch Revoke Attestations**: Efficiently revoke multiple attestations

### View Functions
- **Get Single Attestation**: Retrieve attestation details by ID
- **Get User Attestations**: Get all attestations for a user
- **Get Active User Attestations**: Get only valid (non-revoked, non-expired) attestations
- **Get Schema**: Retrieve schema information
- **Get Company Schemas**: Get all schemas created by a company
- **Get Company Attestations**: Get all attestations issued by a company
- **Get Schema Attestations**: Get all attestations for a specific schema
- **Is Attestation Valid**: Check if an attestation is valid
- **Get User Attestation Count**: Get the total number of attestations for a user
- **Get Company Info**: Get company information

## Gas Optimization Features

1. **Batch Operations**: Batch functions reduce gas costs for multiple operations
2. **Efficient Storage**: Using mappings and arrays for optimal storage patterns
3. **Packed Structs**: Structs are designed to minimize storage slots
4. **Events**: Comprehensive events for off-chain indexing
5. **Minimal State Changes**: Only necessary state updates

## Security Features

1. **Access Control**: Role-based access control with modifiers
2. **Input Validation**: Comprehensive validation of all inputs
3. **Zero Address Checks**: Prevention of zero address assignments
4. **State Validation**: Checks for active schemas and valid attestations
5. **Ownership Validation**: Only schema owners can manage their schemas

## Usage

### Compile
```bash
npm run compile
```

### Test
```bash
npm run test
```

### Deploy
```bash
npm run deploy
```

## Contract Structure

### Core Mappings
- `isWhitelistedCompany`: Quick check if address is whitelisted
- `companies`: Company information storage
- `schemas`: Schema definitions
- `attestations`: Attestation records
- `userAttestations`: User to attestation IDs mapping
- `companySchemas`: Company to schema IDs mapping
- `companyAttestations`: Company to attestation IDs mapping
- `schemaAttestations`: Schema to attestation IDs mapping

### Events
All state changes emit events for off-chain indexing:
- `AdminChanged`
- `CompanyWhitelisted`
- `CompanyRemoved`
- `SchemaCreated`
- `SchemaUpdated`
- `AttestationIssued`
- `AttestationRevoked`

## Example Flow

1. Admin whitelists a company
2. Company creates a schema (e.g., "University Degree")
3. Company issues attestations to users
4. Users can query their attestations
5. Company can revoke attestations if needed

## Edge Cases Handled

- Duplicate whitelisting prevention
- Invalid address checks
- Expired attestation validation
- Revoked attestation handling
- Schema ownership validation
- Batch operation array length validation
- Empty array prevention

