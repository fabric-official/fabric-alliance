#!/usr/bin/env node
const { ethers } = require("ethers");
const fs = require("fs");

const CONTRACT_ADDRESS = "<DEPLOYED_CERT_ENFORCEMENT_ADDRESS>";
const ABI = JSON.parse(fs.readFileSync("./tools/smart-contracts/CertificationEnforcementABI.json"));

async function verifyAgent(agentAddress) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const isCertified = await contract.isCertified(agentAddress);
    if (!isCertified) {
        console.log(`❌ Agent ${agentAddress} is NOT certified.`);
        process.exit(1);
    }

    const badges = await contract.getBadges(agentAddress);
    const royaltyAddress = await contract.royaltyAddressFor(agentAddress);

    console.log(`✅ Agent ${agentAddress} is certified.`);
    console.log(`   Badges: ${badges.join(", ")}`);
    console.log(`   Royalty Address: ${royaltyAddress}`);
}

const agentAddress = process.argv[2];
if (!agentAddress) {
    console.error("Usage: fab-cert-check <agentAddress>");
    process.exit(1);
}

verifyAgent(agentAddress);
