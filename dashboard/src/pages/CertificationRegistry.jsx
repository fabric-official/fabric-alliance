import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CertificationStatus from '../components/CertificationStatus';
import './CertificationRegistry.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CERT_ENFORCEMENT_ADDRESS;
const ABI = require('../abis/CertificationEnforcement.json');

export default function CertificationRegistry() {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertifiedAgents() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // Assuming DAO contract emits AgentCertified event with indexed agent
        const filter = contract.filters.AgentCertified();
        const logs = await provider.getLogs({
          ...filter,
          fromBlock: process.env.REACT_APP_DEPLOYMENT_BLOCK,
          toBlock: 'latest',
        });

        const uniqueAgents = [...new Set(logs.map((log) => ethers.getAddress(log.topics[1])))];
        setAgents(uniqueAgents);
      } catch (err) {
        console.error('Error fetching certified agents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCertifiedAgents();
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="registry-loading">Loading Certified Agents...</div>;

  return (
    <div className="certification-registry">
      <h1>Certified Agents Registry</h1>
      <input
        type="text"
        placeholder="Search Agent Address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

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
