
---

# **📂 `/tools/verify-certification.js`**

```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const agentId = process.argv[2];
if (!agentId) {
  console.error("Usage: node verify-certification.js <agent-id>");
  process.exit(1);
}

const certDir = path.resolve(__dirname, "../../certifications/certifications");
if (!fs.existsSync(certDir)) {
  console.error("Error: Certification directory not found.");
  process.exit(1);
}

const files = fs.readdirSync(certDir);
let found = false;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(certDir, file), "utf-8"));
  if (data.agentId === agentId) {
    console.log(`✅ Agent Found:
    - Name: ${data.agentName}
    - Level: ${data.certificationLevel}
    - DAO Proposal: ${data.daoProposalRef}
    - Certified Date: ${data.certifiedDate}`);
    found = true;
    break;
  }
}

if (!found) {
  console.log(`❌ Agent with ID ${agentId} is not certified.`);
}
