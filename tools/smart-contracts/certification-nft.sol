// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificationNFT
 * @notice Non-transferable NFT (Soulbound) representing Fabric Alliance agent certification.
 */
contract CertificationNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => bool) private revoked;

    constructor() ERC721("Fabric Alliance Certification", "FACERT") {
        tokenCounter = 0;
    }

    /// @notice Mint a new certification NFT
    function mintCertification(address recipient, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    /// @notice Revoke a certification NFT (Soulbound)
    function revokeCertification(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        revoked[tokenId] = true;
    }

    /// @notice Prevents transfers (Soulbound behavior)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Certification NFTs are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /// @notice Check if a certification is revoked
    function isRevoked(uint256 tokenId) external view returns (bool) {
        return revoked[tokenId];
    }
}
