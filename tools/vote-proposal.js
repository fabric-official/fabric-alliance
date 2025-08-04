#!/usr/bin/env node
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const CONTRACT_ADDRESS = process.env.CERT_ENFORCEMENT_ADDRESS;
const ABI = JSON.parse(fs.readFileSync("./tools/smart-contracts/CertificationEnforcementABI.json"));

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Arguments
    const proposalId = process.argv[2];
    const action = process.argv[3]; // approve, reject, certify, revoke
    const agentAddress = process.argv[4] || null;
    const royaltyAddress = process.argv[5] || null;
    const badgesFile = process.argv[6] || null;

    if (!proposalId || !action) {
        console.error("Usage: vote-proposal <proposalId> <approve|reject|certify|revoke> [agentAddress royaltyAddress badgesFile]");
        process.exit(1);
    }

    console.log(`🔑 Executing DAO vote/proposal action: ${action} for Proposal ID: ${proposalId}`);

    // Load badges if certifying
    let badges = [];
    if (action === "certify" && badgesFile) {
        try {
            badges = JSON.parse(fs.readFileSync(badgesFile));
            if (!Array.isArray(badges)) throw new Error("Badges must be an array.");
        } catch (err) {
            console.error("❌ Error reading badges file:", err.message);
            process.exit(1);
        }
    }

    // Simulated governance approval
    if (action === "approve") {
        console.log(`✅ Proposal ${proposalId} approved in DAO governance.`);
        return;
    }

    if (action === "reject") {
        console.log(`❌ Proposal ${proposalId} rejected in DAO governance.`);
        return;
    }

    // Trigger certification enforcement
    if (action === "certify") {
        if (!agentAddress || !royaltyAddress) {
            console.error("Usage: vote-proposal <proposalId> certify <agentAddress> <royaltyAddress> <badgesFile>");
            process.exit(1);
        }

        console.log(`🚀 Certifying agent ${agentAddress} with badges: ${badges.join(", ")}`);
        const tx = await contract.certifyAgent(agentAddress, royaltyAddress, badges);
        await tx.wait();
        console.log(`✅ Agent ${agentAddress} certified successfully.`);
    }

    if (action === "revoke") {
        if (!agentAddress) {
            console.error("Usage: vote-proposal <proposalId> revoke <agentAddress>");
            process.exit(1);
        }

        console.log(`⚠️ Revoking certification for agent ${agentAddress}...`);
        const tx = await contract.revokeCertification(agentAddress);
        await tx.wait();
        console.log(`✅ Certification revoked for agent ${agentAddress}.`);
    }
}

main().catch((err) => {
    console.error("❌ Error executing proposal:", err);
    process.exit(1);
});
