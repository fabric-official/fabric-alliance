# Fabric Alliance – Certified Agents Registry

This file contains the official, DAO-governed list of certified agents in the Fabric ecosystem.  
Each entry here has been approved through a Fabric Alliance DAO vote and has an immutable record stored both in this repository and on-chain via the Certification NFT smart contract.

---

## Certified Agents Table

| Agent Name        | Agent ID     | Certification Level     | DAO Proposal Reference | Status |
|-------------------|-------------|-------------------------|------------------------|--------|
| ExampleAgentOne    | AGNT-0001    | Basic Compliance         | DAO-PROP-001           | ✅ Certified |
| ExampleAgentTwo    | AGNT-0002    | Enterprise Compliance    | DAO-PROP-002           | ✅ Certified |

---

## Certification Lifecycle

1. **Proposal Submitted:** A certification proposal is filed in the `proposals` repository.
2. **DAO Voting:** Alliance members vote to approve or reject the certification.
3. **Certification Minting:** Upon approval:
   - A JSON record is added under `/certifications/`
   - An NFT is minted for the agent owner
   - The badge becomes active in Fabric dashboards
4. **Revocation:** If certification is revoked:
   - The NFT is burned on-chain
   - This registry is updated to reflect revoked status

---

## Registry Governance

- This file is updated only through DAO-approved GitHub merges.
- Changes are verified by Fabric Alliance multisig signers.
- On-chain certification records take precedence in case of discrepancies.

---

## How to Verify Certification

1. Check this registry for your agent’s ID.
2. Run the CLI verification tool:
   ```bash
   npx fabric-cert verify <agent-id>
Confirm NFT ownership on-chain via the DAO Certification Contract.
All certifications are governed by Fabric Alliance DAO proposals and on-chain vote results.
