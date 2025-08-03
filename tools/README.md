# Fabric Alliance – Governance and Certification Tools

This repository contains utilities used for **DAO governance** and **agent certification verification** in the Fabric Alliance ecosystem.  
All tools here are fully open-source and maintained under DAO governance.

---

## Repository Structure

/tools
├── README.md
├── verify-certification.js
├── vote-proposal.js
├── smart-contracts/
│ └── certification-nft.sol
└── workflows/
└── test-tools.yml

---

## CLI Tools

### 1. Verify Agent Certification

Checks if an agent is certified by querying the certifications repository.

```bash
node verify-certification.js <agent-id>
✅ Returns agent name, certification level, DAO proposal reference.
❌ Returns "Not Certified" if no record is found.
2. Vote on DAO Proposals
Allows DAO members to submit votes for or against certification proposals.
node vote-proposal.js --proposal DAO-PROP-001 --vote yes
Supports yes, no, and abstain.
Connected to on-chain governance via web3/Ethers.js.
Votes are recorded immutably on-chain.
Smart Contracts
smart-contracts/certification-nft.sol: Solidity contract for non-transferable Certification NFTs (soulbound).
Deployed contract mints NFTs when certifications are approved by DAO governance.
CI Workflow
workflows/test-tools.yml runs automated tests for all CLI tools.
Ensures code quality and contract compilation before merging.
Contributing
Pull requests require DAO multisig approval.
Changes to smart contracts must pass DAO vote and external audit.
See CONTRIBUTING.md for full guidelines.
© 2025 Fabric Alliance – DAO-governed tools for decentralized AI certification.
