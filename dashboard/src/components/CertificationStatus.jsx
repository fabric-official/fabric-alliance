import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './CertificationStatus.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CERT_ENFORCEMENT_ADDRESS;
const ABI = require('../abis/CertificationEnforcement.json');

export default function CertificationStatus({ agentAddress }) {
  const [isCertified, setIsCertified] = useState(false);
  const [badges, setBadges] = useState([]);
  const [royaltyAddress, setRoyaltyAddress] = useState('');
  const [forensicAuditHash, setForensicAuditHash] = useState('');
  const [rollbackVerified, setRollbackVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertification() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        const certified = await contract.isCertified(agentAddress);
        setIsCertified(certified);

        if (certified) {
          const badgesList = await contract.getBadges(agentAddress);
          const royalty = await contract.royaltyAddressFor(agentAddress);
          const forensicHash = await contract.getForensicAuditHash(agentAddress);
          const rollbackStatus = await contract.isRollbackVerified(agentAddress);

          setBadges(badgesList);
          setRoyaltyAddress(royalty);
          setForensicAuditHash(forensicHash);
          setRollbackVerified(rollbackStatus);
        }
      } catch (err) {
        console.error('Error fetching certification:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCertification();
  }, [agentAddress]);

  if (loading) return <div className="certification-loading">Loading certification status...</div>;

  return (
    <div className={`certification-status ${isCertified ? 'certified' : 'not-certified'}`}>
      <h2>Agent Certification Status</h2>
      <p><strong>Agent:</strong> {agentAddress}</p>

      {isCertified ? (
        <>
          <p className="status certified-label">✅ Certified</p>
          <p><strong>Royalty Address:</strong> {royaltyAddress}</p>
          <p><strong>Forensic Audit Hash:</strong> {forensicAuditHash}</p>
          <p><strong>Rollback Verified:</strong> {rollbackVerified ? 'Yes' : 'No'}</p>
          <div className="badges">
            <strong>Badges:</strong>
            {badges.map((badge, index) => (
              <span key={index} className={`badge badge-${badge.replace('-certified', '')}`}>
                {badge}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="status not-certified-label">❌ Not Certified</p>
      )}
    </div>
  );
}
