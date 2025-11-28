// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MintoraResearchPassport
 * @dev ERC-7857 style Intelligent Research NFT with gasless minting
 */
contract MintoraResearchPassport is 
    ERC721, 
    ERC721URIStorage, 
    ERC721Enumerable, 
    Ownable, 
    ReentrancyGuard 
{
    struct PassportData {
        uint256 researchId;
        uint256 mintTimestamp;
        uint256 qualityScore;
        bool isVerified;
    }

    mapping(uint256 => PassportData) public passportData;
    mapping(uint256 => uint256) public researchIdToTokenId;
    mapping(uint256 => address) public tokenRoyaltyRecipient;
    
    uint256 private _tokenIdCounter;
    uint256 public constant ROYALTY_PERCENTAGE = 500; // 5% in basis points
    
    address public minterRole;

    event PassportMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 indexed researchId,
        string tokenURI
    );

    event MinterRoleUpdated(address indexed oldMinter, address indexed newMinter);

    error NotMinter();
    error ResearchAlreadyMinted();
    error InvalidResearchId();

    modifier onlyMinter() {
        if (msg.sender != minterRole && msg.sender != owner()) revert NotMinter();
        _;
    }

    constructor() ERC721("Mintora Research Passport", "MRP") Ownable(msg.sender) {
        minterRole = msg.sender;
    }

    /**
     * @dev Set the minter role (relayer for gasless minting)
     */
    function setMinterRole(address newMinter) external onlyOwner {
        emit MinterRoleUpdated(minterRole, newMinter);
        minterRole = newMinter;
    }

    /**
     * @dev Mint a new Research Passport iNFT (gasless for user)
     * @param to Recipient address
     * @param researchId Associated research ID from MintoraAnchor
     * @param uri Token metadata URI
     */
    function mintResearchPassport(
        address to,
        uint256 researchId,
        string calldata uri
    ) external onlyMinter nonReentrant returns (uint256) {
        if (researchId == 0) revert InvalidResearchId();
        if (researchIdToTokenId[researchId] != 0) revert ResearchAlreadyMinted();

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);

        passportData[newTokenId] = PassportData({
            researchId: researchId,
            mintTimestamp: block.timestamp,
            qualityScore: 0,
            isVerified: false
        });

        researchIdToTokenId[researchId] = newTokenId;
        tokenRoyaltyRecipient[newTokenId] = to;

        emit PassportMinted(newTokenId, to, researchId, uri);

        return newTokenId;
    }

    /**
     * @dev Update passport verification status and score
     */
    function updatePassportData(
        uint256 tokenId,
        uint256 qualityScore,
        bool isVerified
    ) external onlyMinter {
        passportData[tokenId].qualityScore = qualityScore;
        passportData[tokenId].isVerified = isVerified;
    }

    /**
     * @dev Get royalty info for a token (ERC-2981 style)
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        receiver = tokenRoyaltyRecipient[tokenId];
        royaltyAmount = (salePrice * ROYALTY_PERCENTAGE) / 10000;
    }

    /**
     * @dev Get all tokens owned by an address
     */
    function getOwnedTokens(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    // Required overrides
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


