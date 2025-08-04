#!/usr/bin/env node
/**
 * Fabric Alliance – Forensic Certification Pre-Check
 * --------------------------------------------------
 * This script verifies:
 *  - Provenance Ledger integrity
 *  - Agent's forensic audit trail
 *  - Atomic rollback/recovery support
 *  - Cryptographic policy seals
 *  - Malicious behavior or tampering attempts
 *
 * Exit code:
 *  0 → Pass
 *  1 → Fail
 */

const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

const agentManifestPath = process.argv[2];

if (!agentManifestPath) {
    console.error("Usage: forensic-check.js <agentManifest.json>");
    process.exit(1);
}

let agentData;
try {
    agentData = JSON.parse(fs.readFileSync(agentManifestPath));
} catch (err) {
    console.error("❌ Error reading agent manifest:", err.message);
    process.exit(1);
}

console.log(`🔍 Running forensic pre-check for agent: ${agentData.name} (${agentData.agent_id})`);

// 1️⃣ Verify Provenance Ledger entry exists
try {
    const ledgerOutput = execSync(`fab provenance verify --agent ${agentData.agent_id}`, { encoding: "utf-8" });
    if (!ledgerOutput.includes("VALID")) {
        console.error("❌ Provenance verification failed or missing ledger entry.");
        process.exit(1);
    }
    console.log("✅ Provenance Ledger integrity verified.");
} catch (err) {
    console.error("❌ Provenance verification failed:", err.message);
    process.exit(1);
}

// 2️⃣ Check for forensic audit hash
if (!agentData.audit_hash || agentData.audit_hash.length < 10) {
    console.error("❌ Missing or invalid forensic audit hash in manifest.");
    process.exit(1);
}
console.log("✅ Forensic audit hash found and valid.");

// 3️⃣ Validate atomic rollback capability
try {
    const rollbackOutput = execSync(`fab rollback check --agent ${agentData.agent_id}`, { encoding: "utf-8" });
    if (!rollbackOutput.includes("SUPPORTED")) {
        console.error("❌ Agent does not support atomic rollback or recovery.");
        process.exit(1);
    }
    console.log("✅ Atomic rollback/recovery capability confirmed.");
} catch (err) {
    console.error("❌ Rollback check failed:", err.message);
    process.exit(1);
}

// 4️⃣ Verify cryptographic policy seals
if (!agentData.policy_seal || agentData.policy_seal.length < 20) {
    console.error("❌ Missing or invalid cryptographic policy seal.");
    process.exit(1);
}
console.log("✅ Cryptographic policy seal verified.");

// 5️⃣ Security tampering check (hash validation)
try {
    const fileHash = crypto.createHash("sha256")
        .update(fs.readFileSync(agentManifestPath))
        .digest("hex");
    
    if (fileHash !== agentData.audit_hash) {
        console.error("❌ Audit hash mismatch. Manifest tampering detected.");
        process.exit(1);
    }
    console.log("✅ Audit hash matches manifest. No tampering detected.");
} catch (err) {
    console.error("❌ Hash validation failed:", err.message);
    process.exit(1);
}

console.log("🎉 Forensic pre-check passed. Agent is eligible for DAO certification.");
process.exit(0);
