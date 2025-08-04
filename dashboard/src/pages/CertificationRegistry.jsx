import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CertificationStatus from '../components/CertificationStatus';
import './CertificationRegistry.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CERT_ENFORCEMENT_ADDRESS;
const ABI = require('../abis/CertificationEnforcement.json');

export default function CertificationRegistry() {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badgesMap, setBadgesMap] = useState({});

  useEffect(() => {
    async function fetchCertifiedAgents() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        const filter = contract.filters.AgentCertified();
        const logs = await provider.getLogs({
          ...filter,
          fromBlock: process.env.REACT_APP_DEPLOYMENT_BLOCK,
          toBlock: 'latest',
        });

        const uniqueAgents = [...new Set(logs.map((log) => ethers.getAddress(log.topics[1])))];
        const badgesData = {};

        for (const agent of uniqueAgents) {
          try {
            const agentBadges = await contract.getBadges(agent);
            badgesData[agent] = agentBadges;
          } catch (err) {
            console.warn(`Failed to fetch badges for agent ${agent}:`, err.message);
          }
        }

        setAgents(uniqueAgents);
        setBadgesMap(badgesData);
      } catch (err) {
        console.error('Error fetching certified agents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCertifiedAgents();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.toLowerCase().includes(searchQuery.toLowerCase());
    if (!selectedBadge) return matchesSearch;
    return matchesSearch && badgesMap[agent]?.includes(selectedBadge);
  });

  if (loading) return <div className="registry-loading">Loading Certified Agents...</div>;

  return (
    <div className="certification-registry">
      <h1>Certified Agents Registry</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search Agent Address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
          className="badge-filter"
        >
          <option value="">All Badges</option>
          <option value="ethical-certified">Ethical Certified</option>
          <option value="eco-certified">Environmental Certified</option>
          <option value="forensic-certified">Forensic Certified</option>
          <option value="crosschain-certified">Cross-Chain Certified</option>
          <option value="failsafe-certified">Fail-Safe Certified</option>
        </select>
      </div>

      <table className="agents-table">
        <thead>
          <tr>
            <th>Agent Address</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <tr key={agent}>
                <td>{agent}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    View Certification
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-agents">
                No certified agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedAgent && (
        <div className="agent-details-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedAgent(null)}>✖</button>
            <CertificationStatus agentAddress={selectedAgent} />
          </div>
        </div>
      )}
    </div>
  );
}
