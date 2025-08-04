// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Fabric Alliance – Certification Enforcement Contract
 * ----------------------------------------------------
 * Enforces agent certification for Fabric DAO:
 *  - Stores certification badges
 *  - Links royalty addresses
 *  - Includes forensic audit hash
 *  - Tracks atomic rollback verification status
 *  - DAO-governed certification and revocation
 */

contract CertificationEnforcement {
    struct AgentCert {
        bool isCertified;
        address royaltyAddress;
        uint256 certifiedAt;
        string[] badges;
        string forensicAuditHash;
        bool rollbackVerified;
    }

    mapping(address => AgentCert) public certifiedAgents;
    address public daoGovernance;

    event AgentCertified(
        address indexed agent,
        address royaltyAddress,
        string[] badges,
        string forensicAuditHash,
        bool rollbackVerified
    );

    event CertificationRevoked(address indexed agent);

    modifier onlyDAO() {
        require(msg.sender == daoGovernance, "Only DAO governance allowed");
        _;
    }

    constructor(address _daoGovernance) {
        daoGovernance = _daoGovernance;
    }

    /**
     * Certify Agent
     * ----------------------------------------------------
     * Called only by DAO governance contract after proposal approval
     */
    function certifyAgent(
        address agent,
        address royaltyAddress,
        string[] calldata badges,
        string calldata forensicAuditHash,
        bool rollbackVerified
    ) external onlyDAO {
        certifiedAgents[agent] = AgentCert(
            true,
            royaltyAddress,
            block.timestamp,
            badges,
            forensicAuditHash,
            rollbackVerified
        );
        emit AgentCertified(agent, royaltyAddress, badges, forensicAuditHash, rollbackVerified);
    }

    /**
     * Revoke certification
     */
    function revokeCertification(address agent) external onlyDAO {
        certifiedAgents[agent].isCertified = false;
        emit CertificationRevoked(agent);
    }

    /**
     * Query: isCertified
     */
    function isCertified(address agent) public view returns (bool) {
        return certifiedAgents[agent].isCertified;
    }

    /**
     * Query: getBadges
     */
    function getBadges(address agent) public view returns (string[] memory) {
        return certifiedAgents[agent].badges;
    }

    /**
     * Query: getRoyaltyAddress
     */
    function royaltyAddressFor(address agent) public view returns (address) {
        require(isCertified(agent), "Agent not certified");
        return certifiedAgents[agent].royaltyAddress;
    }

    /**
     * Query: getForensicAuditHash
     */
    function getForensicAuditHash(address agent) public view returns (string memory) {
        require(isCertified(agent), "Agent not certified");
        return certifiedAgents[agent].forensicAuditHash;
    }

    /**
     * Query: getRollbackStatus
     */
    function isRollbackVerified(address agent) public view returns (bool) {
        require(isCertified(agent), "Agent not certified");
        return certifiedAgents[agent].rollbackVerified;
    }
}
