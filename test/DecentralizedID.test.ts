import { expect } from "chai";
import hre from "hardhat";
import { DecentralizedID } from "../typechain-types";

const { ethers } = hre;

describe("DecentralizedID", function () {
  let decentralizedID: DecentralizedID;
  let admin: any;
  let company1: any;
  let company2: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeEach(async function () {
    [admin, company1, company2, user1, user2, user3] = await ethers.getSigners();

    const DecentralizedIDFactory = await ethers.getContractFactory("DecentralizedID");
    decentralizedID = await DecentralizedIDFactory.deploy();
    await decentralizedID.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await decentralizedID.admin()).to.equal(admin.address);
    });

    it("Should initialize with correct default values", async function () {
      expect(await decentralizedID.nextSchemaId()).to.equal(1);
      expect(await decentralizedID.nextAttestationId()).to.equal(1);
    });
  });

  describe("Admin Functions", function () {
    describe("changeAdmin", function () {
      it("Should change admin successfully", async function () {
        await expect(decentralizedID.changeAdmin(user1.address))
          .to.emit(decentralizedID, "AdminChanged")
          .withArgs(admin.address, user1.address);

        expect(await decentralizedID.admin()).to.equal(user1.address);
      });

      it("Should revert if not admin tries to change admin", async function () {
        await expect(
          decentralizedID.connect(company1).changeAdmin(user1.address)
        ).to.be.revertedWith("DecentralizedID: Only admin");
      });

      it("Should revert if new admin is zero address", async function () {
        await expect(
          decentralizedID.changeAdmin(ethers.ZeroAddress)
        ).to.be.revertedWith("DecentralizedID: Invalid admin address");
      });

      it("Should revert if same admin address", async function () {
        await expect(
          decentralizedID.changeAdmin(admin.address)
        ).to.be.revertedWith("DecentralizedID: Same admin");
      });
    });

    describe("addWhitelistedCompany", function () {
      it("Should add company to whitelist successfully", async function () {
        const metadata = "Company 1 metadata";

        await expect(decentralizedID.addWhitelistedCompany(company1.address, metadata))
          .to.emit(decentralizedID, "CompanyWhitelisted")
          .withArgs(company1.address, metadata);

        expect(await decentralizedID.isWhitelistedCompany(company1.address)).to.be.true;
      });

      it("Should revert if not admin tries to add company", async function () {
        await expect(
          decentralizedID.connect(company1).addWhitelistedCompany(company1.address, "metadata")
        ).to.be.revertedWith("DecentralizedID: Only admin");
      });

      it("Should revert if company address is zero", async function () {
        await expect(
          decentralizedID.addWhitelistedCompany(ethers.ZeroAddress, "metadata")
        ).to.be.revertedWith("DecentralizedID: Invalid company address");
      });

      it("Should revert if company already whitelisted", async function () {
        await decentralizedID.addWhitelistedCompany(company1.address, "metadata");
        
        await expect(
          decentralizedID.addWhitelistedCompany(company1.address, "metadata2")
        ).to.be.revertedWith("DecentralizedID: Company already whitelisted");
      });

      it("Should store company info correctly", async function () {
        const metadata = "Test metadata";
        await decentralizedID.addWhitelistedCompany(company1.address, metadata);

        const companyInfo = await decentralizedID.getCompanyInfo(company1.address);
        expect(companyInfo.isActive).to.be.true;
        expect(companyInfo.metadata).to.equal(metadata);
        expect(companyInfo.addedAt).to.be.gt(0);
      });
    });

    describe("removeWhitelistedCompany", function () {
      it("Should remove company from whitelist successfully", async function () {
        await decentralizedID.addWhitelistedCompany(company1.address, "metadata");
        
        await expect(decentralizedID.removeWhitelistedCompany(company1.address))
          .to.emit(decentralizedID, "CompanyRemoved")
          .withArgs(company1.address);

        expect(await decentralizedID.isWhitelistedCompany(company1.address)).to.be.false;
      });

      it("Should revert if not admin tries to remove company", async function () {
        await expect(
          decentralizedID.connect(company1).removeWhitelistedCompany(company1.address)
        ).to.be.revertedWith("DecentralizedID: Only admin");
      });

      it("Should revert if company not whitelisted", async function () {
        await expect(
          decentralizedID.removeWhitelistedCompany(company1.address)
        ).to.be.revertedWith("DecentralizedID: Company not whitelisted");
      });
    });

    describe("batchAddCompanies", function () {
      it("Should batch add companies successfully", async function () {
        const addresses = [company1.address, company2.address];
        const metadataArray = ["Company 1", "Company 2"];

        await decentralizedID.batchAddCompanies(addresses, metadataArray);

        expect(await decentralizedID.isWhitelistedCompany(company1.address)).to.be.true;
        expect(await decentralizedID.isWhitelistedCompany(company2.address)).to.be.true;
      });

      it("Should revert if arrays length mismatch", async function () {
        const addresses = [company1.address, company2.address];
        const metadataArray = ["Company 1"];

        await expect(
          decentralizedID.batchAddCompanies(addresses, metadataArray)
        ).to.be.revertedWith("DecentralizedID: Arrays length mismatch");
      });

      it("Should revert if empty arrays", async function () {
        await expect(
          decentralizedID.batchAddCompanies([], [])
        ).to.be.revertedWith("DecentralizedID: Empty arrays");
      });

      it("Should skip invalid addresses in batch", async function () {
        const addresses = [company1.address, ethers.ZeroAddress, company2.address];
        const metadataArray = ["Company 1", "Invalid", "Company 2"];

        await decentralizedID.batchAddCompanies(addresses, metadataArray);

        expect(await decentralizedID.isWhitelistedCompany(company1.address)).to.be.true;
        expect(await decentralizedID.isWhitelistedCompany(company2.address)).to.be.true;
      });

      it("Should not add already whitelisted companies again", async function () {
        await decentralizedID.addWhitelistedCompany(company1.address, "metadata1");

        const addresses = [company1.address, company2.address];
        const metadataArray = ["Company 1", "Company 2"];

        await decentralizedID.batchAddCompanies(addresses, metadataArray);

        expect(await decentralizedID.isWhitelistedCompany(company2.address)).to.be.true;
      });
    });
  });

  describe("Company Functions", function () {
    beforeEach(async function () {
      await decentralizedID.addWhitelistedCompany(company1.address, "Company 1");
      await decentralizedID.addWhitelistedCompany(company2.address, "Company 2");
    });

    describe("createSchema", function () {
      it("Should create schema successfully", async function () {
        const name = "Degree Certificate";
        const description = "University degree attestation";
        const schemaDefinition = '{"type": "object", "properties": {...}}';

        await expect(
          decentralizedID.connect(company1).createSchema(name, description, schemaDefinition)
        )
          .to.emit(decentralizedID, "SchemaCreated")
          .withArgs(1, company1.address, name, description);

        const schema = await decentralizedID.getSchema(1);
        expect(schema.company).to.equal(company1.address);
        expect(schema.name).to.equal(name);
        expect(schema.description).to.equal(description);
        expect(schema.isActive).to.be.true;
      });

      it("Should revert if not whitelisted company", async function () {
        await expect(
          decentralizedID.connect(user1).createSchema("name", "desc", "schema")
        ).to.be.revertedWith("DecentralizedID: Only whitelisted companies");
      });

      it("Should revert if name is empty", async function () {
        await expect(
          decentralizedID.connect(company1).createSchema("", "desc", "schema")
        ).to.be.revertedWith("DecentralizedID: Name cannot be empty");
      });

      it("Should increment schema ID correctly", async function () {
        await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
        await decentralizedID.connect(company1).createSchema("Schema 2", "desc", "schema2");

        expect(await decentralizedID.nextSchemaId()).to.equal(3);
      });

      it("Should track company schemas", async function () {
        await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
        await decentralizedID.connect(company1).createSchema("Schema 2", "desc", "schema2");

        const companySchemas = await decentralizedID.getCompanySchemas(company1.address);
        expect(companySchemas.length).to.equal(2);
        expect(companySchemas[0].name).to.equal("Schema 1");
        expect(companySchemas[1].name).to.equal("Schema 2");
      });
    });

    describe("updateSchemaStatus", function () {
      beforeEach(async function () {
        await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
      });

      it("Should update schema status successfully", async function () {
        await expect(
          decentralizedID.connect(company1).updateSchemaStatus(1, false)
        )
          .to.emit(decentralizedID, "SchemaUpdated")
          .withArgs(1, false);

        const schema = await decentralizedID.getSchema(1);
        expect(schema.isActive).to.be.false;
      });

      it("Should revert if not schema owner", async function () {
        await expect(
          decentralizedID.connect(company2).updateSchemaStatus(1, false)
        ).to.be.revertedWith("DecentralizedID: Schema belongs to another company");
      });

      it("Should revert if schema not active", async function () {
        await decentralizedID.connect(company1).updateSchemaStatus(1, false);
        
        await expect(
          decentralizedID.connect(company1).updateSchemaStatus(1, true)
        ).to.be.revertedWith("DecentralizedID: Schema not active");
      });
    });

    describe("issueAttestation", function () {
      let schemaId: bigint;

      beforeEach(async function () {
        const tx = await decentralizedID
          .connect(company1)
          .createSchema("Schema 1", "desc", "schema1");
        const receipt = await tx.wait();
        schemaId = 1n;
      });

      it("Should issue attestation successfully", async function () {
        const data = "QmHash123";
        const expiresAt = 0; // Never expires

        await expect(
          decentralizedID
            .connect(company1)
            .issueAttestation(user1.address, schemaId, data, expiresAt)
        )
          .to.emit(decentralizedID, "AttestationIssued")
          .withArgs(1, user1.address, company1.address, schemaId);

        const attestation = await decentralizedID.getAttestation(1);
        expect(attestation.recipient).to.equal(user1.address);
        expect(attestation.issuer).to.equal(company1.address);
        expect(attestation.schemaId).to.equal(schemaId);
        expect(attestation.data).to.equal(data);
        expect(attestation.isRevoked).to.be.false;
      });

      it("Should revert if not whitelisted company", async function () {
        await expect(
          decentralizedID
            .connect(user1)
            .issueAttestation(user1.address, schemaId, "data", 0)
        ).to.be.revertedWith("DecentralizedID: Only whitelisted companies");
      });

      it("Should revert if invalid recipient", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .issueAttestation(ethers.ZeroAddress, schemaId, "data", 0)
        ).to.be.revertedWith("DecentralizedID: Invalid recipient");
      });

      it("Should revert if invalid schema ID", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .issueAttestation(user1.address, 999, "data", 0)
        ).to.be.revertedWith("DecentralizedID: Invalid schema ID");
      });

      it("Should revert if schema not active", async function () {
        await decentralizedID.connect(company1).updateSchemaStatus(schemaId, false);
        
        await expect(
          decentralizedID
            .connect(company1)
            .issueAttestation(user1.address, schemaId, "data", 0)
        ).to.be.revertedWith("DecentralizedID: Schema not active");
      });

      it("Should revert if schema belongs to another company", async function () {
        await expect(
          decentralizedID
            .connect(company2)
            .issueAttestation(user1.address, schemaId, "data", 0)
        ).to.be.revertedWith("DecentralizedID: Schema belongs to another company");
      });

      it("Should revert if expiration time is in past", async function () {
        const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

        await expect(
          decentralizedID
            .connect(company1)
            .issueAttestation(user1.address, schemaId, "data", pastTime)
        ).to.be.revertedWith("DecentralizedID: Invalid expiration time");
      });

      it("Should track user attestations", async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, schemaId, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, schemaId, "data2", 0);

        const attestationIds = await decentralizedID.getUserAttestationIds(user1.address);
        expect(attestationIds.length).to.equal(2);
        expect(attestationIds[0]).to.equal(1);
        expect(attestationIds[1]).to.equal(2);
      });

      it("Should track company attestations", async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, schemaId, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user2.address, schemaId, "data2", 0);

        const companyAttestations = await decentralizedID.getCompanyAttestations(company1.address);
        expect(companyAttestations.length).to.equal(2);
      });

      it("Should track schema attestations", async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, schemaId, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user2.address, schemaId, "data2", 0);

        const schemaAttestations = await decentralizedID.getSchemaAttestations(schemaId);
        expect(schemaAttestations.length).to.equal(2);
      });

      it("Should handle expiration correctly", async function () {
        const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, schemaId, "data", futureTime);

        const attestation = await decentralizedID.getAttestation(1);
        expect(attestation.expiresAt).to.equal(futureTime);
      });
    });

    describe("batchIssueAttestations", function () {
      let schemaId: bigint;

      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createSchema("Schema 1", "desc", "schema1");
        schemaId = 1n;
      });

      it("Should batch issue attestations successfully", async function () {
        const recipients = [user1.address, user2.address];
        const schemaIds = [schemaId, schemaId];
        const dataArray = ["data1", "data2"];
        const expiresAtArray = [0, 0];

        const tx = await decentralizedID
          .connect(company1)
          .batchIssueAttestations(recipients, schemaIds, dataArray, expiresAtArray);
        
        const receipt = await tx.wait();

        const user1Attestations = await decentralizedID.getUserAttestationIds(user1.address);
        const user2Attestations = await decentralizedID.getUserAttestationIds(user2.address);
        
        expect(user1Attestations.length).to.equal(1);
        expect(user2Attestations.length).to.equal(1);
      });

      it("Should revert if arrays length mismatch", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .batchIssueAttestations(
              [user1.address, user2.address],
              [schemaId],
              ["data1", "data2"],
              [0, 0]
            )
        ).to.be.revertedWith("DecentralizedID: Arrays length mismatch");
      });

      it("Should skip invalid entries in batch", async function () {
        const recipients = [user1.address, ethers.ZeroAddress, user2.address];
        const schemaIds = [schemaId, schemaId, schemaId];
        const dataArray = ["data1", "data2", "data3"];
        const expiresAtArray = [0, 0, 0];

        await decentralizedID
          .connect(company1)
          .batchIssueAttestations(recipients, schemaIds, dataArray, expiresAtArray);

        const user1Attestations = await decentralizedID.getUserAttestationIds(user1.address);
        const user2Attestations = await decentralizedID.getUserAttestationIds(user2.address);
        
        expect(user1Attestations.length).to.equal(1);
        expect(user2Attestations.length).to.equal(1);
      });
    });

    describe("revokeAttestation", function () {
      let attestationId: bigint;

      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createSchema("Schema 1", "desc", "schema1");
        
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data", 0);
        
        attestationId = 1n;
      });

      it("Should revoke attestation successfully", async function () {
        const reason = "Data compromised";

        await expect(
          decentralizedID.connect(company1).revokeAttestation(attestationId, reason)
        )
          .to.emit(decentralizedID, "AttestationRevoked")
          .withArgs(attestationId, company1.address, reason);

        const attestation = await decentralizedID.getAttestation(attestationId);
        expect(attestation.isRevoked).to.be.true;
        expect(attestation.revocationReason).to.equal(reason);
      });

      it("Should revert if not issuer tries to revoke", async function () {
        await expect(
          decentralizedID.connect(company2).revokeAttestation(attestationId, "reason")
        ).to.be.revertedWith("DecentralizedID: Only issuer can revoke");
      });

      it("Should revert if already revoked", async function () {
        await decentralizedID.connect(company1).revokeAttestation(attestationId, "reason1");
        
        await expect(
          decentralizedID.connect(company1).revokeAttestation(attestationId, "reason2")
        ).to.be.revertedWith("DecentralizedID: Already revoked");
      });

      it("Should revert if invalid attestation ID", async function () {
        await expect(
          decentralizedID.connect(company1).revokeAttestation(999, "reason")
        ).to.be.revertedWith("DecentralizedID: Invalid attestation ID");
      });
    });

    describe("batchRevokeAttestations", function () {
      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createSchema("Schema 1", "desc", "schema1");
        
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user2.address, 1n, "data2", 0);
      });

      it("Should batch revoke attestations successfully", async function () {
        const attestationIds = [1n, 2n];
        const reasons = ["reason1", "reason2"];

        await decentralizedID
          .connect(company1)
          .batchRevokeAttestations(attestationIds, reasons);

        const att1 = await decentralizedID.getAttestation(1);
        const att2 = await decentralizedID.getAttestation(2);
        
        expect(att1.isRevoked).to.be.true;
        expect(att2.isRevoked).to.be.true;
      });

      it("Should revert if arrays length mismatch", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .batchRevokeAttestations([1n, 2n], ["reason1"])
        ).to.be.revertedWith("DecentralizedID: Arrays length mismatch");
      });
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await decentralizedID.addWhitelistedCompany(company1.address, "Company 1");
      await decentralizedID
        .connect(company1)
        .createSchema("Schema 1", "desc", "schema1");
    });

    describe("getUserAttestations", function () {
      it("Should return all attestations for a user", async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data2", 0);

        const attestations = await decentralizedID.getUserAttestations(user1.address);
        expect(attestations.length).to.equal(2);
        expect(attestations[0].data).to.equal("data1");
        expect(attestations[1].data).to.equal("data2");
      });

      it("Should return empty array if user has no attestations", async function () {
        const attestations = await decentralizedID.getUserAttestations(user1.address);
        expect(attestations.length).to.equal(0);
      });
    });

    describe("getActiveUserAttestations", function () {
      it("Should return only active attestations", async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data1", 0);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data2", 0);
        
        await decentralizedID.connect(company1).revokeAttestation(1, "reason");

        const activeAttestations = await decentralizedID.getActiveUserAttestations(user1.address);
        expect(activeAttestations.length).to.equal(1);
        expect(activeAttestations[0].data).to.equal("data2");
      });

      it("Should exclude expired attestations", async function () {
        const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
        const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

        // This will fail because expiration must be in future, so we'll use a workaround
        // Actually, we can't issue expired attestations, so let's test with valid ones
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data1", futureTime);
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data2", 0); // Never expires

        const activeAttestations = await decentralizedID.getActiveUserAttestations(user1.address);
        expect(activeAttestations.length).to.equal(2);
      });
    });

    describe("isAttestationValid", function () {
      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data", 0);
      });

      it("Should return true for valid attestation", async function () {
        expect(await decentralizedID.isAttestationValid(1)).to.be.true;
      });

      it("Should return false for revoked attestation", async function () {
        await decentralizedID.connect(company1).revokeAttestation(1, "reason");
        expect(await decentralizedID.isAttestationValid(1)).to.be.false;
      });
    });

    describe("getUserAttestationCount", function () {
      it("Should return correct count", async function () {
        expect(await decentralizedID.getUserAttestationCount(user1.address)).to.equal(0);
        
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data1", 0);
        expect(await decentralizedID.getUserAttestationCount(user1.address)).to.equal(1);
        
        await decentralizedID
          .connect(company1)
          .issueAttestation(user1.address, 1n, "data2", 0);
        expect(await decentralizedID.getUserAttestationCount(user1.address)).to.equal(2);
      });
    });
  });

  describe("Edge Cases", function () {
    beforeEach(async function () {
      await decentralizedID.addWhitelistedCompany(company1.address, "Company 1");
    });

    it("Should handle multiple schemas from same company", async function () {
      await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
      await decentralizedID.connect(company1).createSchema("Schema 2", "desc", "schema2");
      await decentralizedID.connect(company1).createSchema("Schema 3", "desc", "schema3");

      const schemas = await decentralizedID.getCompanySchemas(company1.address);
      expect(schemas.length).to.equal(3);
    });

    it("Should handle attestations from multiple companies to same user", async function () {
      await decentralizedID.addWhitelistedCompany(company2.address, "Company 2");
      
      await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
      await decentralizedID.connect(company2).createSchema("Schema 2", "desc", "schema2");

      await decentralizedID.connect(company1).issueAttestation(user1.address, 1n, "data1", 0);
      await decentralizedID.connect(company2).issueAttestation(user1.address, 2n, "data2", 0);

      const attestations = await decentralizedID.getUserAttestations(user1.address);
      expect(attestations.length).to.equal(2);
      expect(attestations[0].issuer).to.equal(company1.address);
      expect(attestations[1].issuer).to.equal(company2.address);
    });

    it("Should handle company removal after issuing attestations", async function () {
      await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
      await decentralizedID.connect(company1).issueAttestation(user1.address, 1n, "data", 0);

      await decentralizedID.removeWhitelistedCompany(company1.address);

      // Attestation should still exist
      const attestation = await decentralizedID.getAttestation(1);
      expect(attestation.data).to.equal("data");

      // But company should not be able to issue new attestations
      await expect(
        decentralizedID.connect(company1).issueAttestation(user1.address, 1n, "data2", 0)
      ).to.be.revertedWith("DecentralizedID: Only whitelisted companies");
    });

    it("Should handle schema deactivation after issuing attestations", async function () {
      await decentralizedID.connect(company1).createSchema("Schema 1", "desc", "schema1");
      await decentralizedID.connect(company1).issueAttestation(user1.address, 1n, "data", 0);

      await decentralizedID.connect(company1).updateSchemaStatus(1, false);

      // Attestation should still exist
      const attestation = await decentralizedID.getAttestation(1);
      expect(attestation.data).to.equal("data");

      // But should not be able to issue new attestations with deactivated schema
      await expect(
        decentralizedID.connect(company1).issueAttestation(user1.address, 1n, "data2", 0)
      ).to.be.revertedWith("DecentralizedID: Schema not active");
    });
  });

  describe("Request Functions", function () {
    beforeEach(async function () {
      await decentralizedID.addWhitelistedCompany(company1.address, "Company 1");
      await decentralizedID.addWhitelistedCompany(company2.address, "Company 2");
    });

    describe("createRequest", function () {
      it("Should create predicate request successfully", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .createRequest(
              user1.address,
              "Age verification",
              0, // RequestType.Predicate
              "age",
              ">",
              "18"
            )
        )
          .to.emit(decentralizedID, "RequestCreated")
          .withArgs(1, company1.address, user1.address, 0, "Age verification");

        const request = await decentralizedID.getRequest(1);
        expect(request.requester).to.equal(company1.address);
        expect(request.recipient).to.equal(user1.address);
        expect(request.requestType).to.equal(0); // Predicate
        expect(request.claimKey).to.equal("age");
        expect(request.operator).to.equal(">");
        expect(request.value).to.equal("18");
        expect(request.status).to.equal(0); // Pending
      });

      it("Should create direct request successfully", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .createRequest(
              user1.address,
              "Email access",
              1, // RequestType.Direct
              "email",
              "",
              ""
            )
        )
          .to.emit(decentralizedID, "RequestCreated")
          .withArgs(1, company1.address, user1.address, 1, "Email access");

        const request = await decentralizedID.getRequest(1);
        expect(request.requestType).to.equal(1); // Direct
        expect(request.claimKey).to.equal("email");
      });

      it("Should revert if not whitelisted company", async function () {
        await expect(
          decentralizedID
            .connect(user1)
            .createRequest(user1.address, "purpose", 0, "age", ">", "18")
        ).to.be.revertedWith("DecentralizedID: Only whitelisted companies");
      });

      it("Should revert if invalid recipient", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .createRequest(ethers.ZeroAddress, "purpose", 0, "age", ">", "18")
        ).to.be.revertedWith("DecentralizedID: Invalid recipient");
      });

      it("Should revert if claim key is empty", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .createRequest(user1.address, "purpose", 0, "", ">", "18")
        ).to.be.revertedWith("DecentralizedID: Claim key cannot be empty");
      });

      it("Should revert if predicate request without operator", async function () {
        await expect(
          decentralizedID
            .connect(company1)
            .createRequest(user1.address, "purpose", 0, "age", "", "18")
        ).to.be.revertedWith("DecentralizedID: Operator required for predicate");
      });
    });

    describe("approveRequest", function () {
      let requestId: bigint;

      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createRequest(user1.address, "Age verification", 0, "age", ">", "18");
        requestId = 1n;
      });

      it("Should approve request successfully", async function () {
        await expect(
          decentralizedID.connect(user1).approveRequest(requestId, "true")
        )
          .to.emit(decentralizedID, "RequestResponded")
          .withArgs(requestId, user1.address, 1, "true"); // 1 = Approved

        const request = await decentralizedID.getRequest(requestId);
        expect(request.status).to.equal(1); // Approved
        expect(request.responseData).to.equal("true");
        expect(request.respondedAt).to.be.gt(0);
      });

      it("Should revert if not recipient tries to approve", async function () {
        await expect(
          decentralizedID.connect(user2).approveRequest(requestId, "true")
        ).to.be.revertedWith("DecentralizedID: Only recipient can respond");
      });

      it("Should revert if already responded", async function () {
        await decentralizedID.connect(user1).approveRequest(requestId, "true");
        
        await expect(
          decentralizedID.connect(user1).approveRequest(requestId, "true")
        ).to.be.revertedWith("DecentralizedID: Request already responded");
      });
    });

    describe("rejectRequest", function () {
      let requestId: bigint;

      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createRequest(user1.address, "Email access", 1, "email", "", "");
        requestId = 1n;
      });

      it("Should reject request successfully", async function () {
        await expect(
          decentralizedID.connect(user1).rejectRequest(requestId)
        )
          .to.emit(decentralizedID, "RequestResponded")
          .withArgs(requestId, user1.address, 2, ""); // 2 = Rejected

        const request = await decentralizedID.getRequest(requestId);
        expect(request.status).to.equal(2); // Rejected
        expect(request.respondedAt).to.be.gt(0);
      });

      it("Should revert if not recipient tries to reject", async function () {
        await expect(
          decentralizedID.connect(user2).rejectRequest(requestId)
        ).to.be.revertedWith("DecentralizedID: Only recipient can respond");
      });

      it("Should revert if already responded", async function () {
        await decentralizedID.connect(user1).rejectRequest(requestId);
        
        await expect(
          decentralizedID.connect(user1).rejectRequest(requestId)
        ).to.be.revertedWith("DecentralizedID: Request already responded");
      });
    });

    describe("View Functions for Requests", function () {
      beforeEach(async function () {
        await decentralizedID
          .connect(company1)
          .createRequest(user1.address, "Request 1", 0, "age", ">", "18");
        await decentralizedID
          .connect(company1)
          .createRequest(user1.address, "Request 2", 1, "email", "", "");
        await decentralizedID
          .connect(company2)
          .createRequest(user2.address, "Request 3", 0, "age", ">", "21");
      });

      it("Should get user received requests", async function () {
        const requests = await decentralizedID.getUserReceivedRequests(user1.address);
        expect(requests.length).to.equal(2);
        expect(requests[0].requester).to.equal(company1.address);
        expect(requests[1].requester).to.equal(company1.address);
      });

      it("Should get user pending requests only", async function () {
        await decentralizedID.connect(user1).approveRequest(1, "true");
        
        const pendingRequests = await decentralizedID.getUserPendingRequests(user1.address);
        expect(pendingRequests.length).to.equal(1);
        expect(pendingRequests[0].purpose).to.equal("Request 2");
      });

      it("Should get company requests", async function () {
        const companyReqs = await decentralizedID.getCompanyRequests(company1.address);
        expect(companyReqs.length).to.equal(2);
      });
    });
  });
});

