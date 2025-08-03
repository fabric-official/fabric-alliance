#!/usr/bin/env node
const { ethers } = require("ethers");

const args = require("minimist")(process.argv.slice(2));
const proposalId = args.proposal;
const vote = args.vote;

if (!proposalId || !vote) {
  console.error("Usage: node vote-proposal.js --proposal <proposal-id> --vote <yes|no|abstain>");
  process.exit(1);
}

async function submitVote() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const daoContract = new ethers.Contract(
      process.env.DAO_CONTRACT_ADDRESS,
      ["function vote(uint256 proposalId, uint8 support) public"],
      signer
    );

    let support;
    switch (vote.toLowerCase()) {
      case "yes": support = 1; break;
      case "no": support = 0; break;
      case "abstain": support = 2; break;
      default:
        console.error("Invalid vote. Use yes, no, or abstain.");
        process.exit(1);
    }

    const tx = await daoContract.vote(proposalId, support);
    await tx.wait();

    console.log(`✅ Vote submitted successfully: ${vote.toUpperCase()} for proposal ${proposalId}`);
  } catch (err) {
    console.error("Error submitting vote:", err.message);
  }
}

submitVote();
