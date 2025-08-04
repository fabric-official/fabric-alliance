// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificationEnforcement {
    struct AgentCert {
        bool isCertified;
        address royaltyAddress;
        uint256 certifiedAt;
        string[] badges;
    }

    mapping(address => AgentCert) public certifiedAgents;
    address public daoGovernance;

    event AgentCertified(address agent, address royaltyAddress, string[] badges);
    event CertificationRevoked(address agent);

    modifier onlyDAO() {
        require(msg.sender == daoGovernance, "Only DAO governance allowed");
        _;
    }

    constructor(address _daoGovernance) {
        daoGovernance = _daoGovernance;
    }

    function certifyAgent(
        address agent,
        address royaltyAddress,
        string[] calldata badges
    ) external onlyDAO {
        certifiedAgents[agent] = AgentCert(true, royaltyAddress, block.timestamp, badges);
        emit AgentCertified(agent, royaltyAddress, badges);
    }

    function revokeCertification(address agent) external onlyDAO {
        certifiedAgents[agent].isCertified = false;
        emit CertificationRevoked(agent);
    }

    function isCertified(address agent) public view returns (bool) {
        return certifiedAgents[agent].isCertified;
    }

    function getBadges(address agent) public view returns (string[] memory) {
        return certifiedAgents[agent].badges;
    }

    function royaltyAddressFor(address agent) public view returns (address) {
        require(isCertified(agent), "Agent not certified");
        return certifiedAgents[agent].royaltyAddress;
    }
}
