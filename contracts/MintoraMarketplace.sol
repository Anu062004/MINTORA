// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MintoraMarketplace
 * @dev NFT Marketplace for Mintora Research Passports with royalties
 */
contract MintoraMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => uint256)) public nftToListingId;
    
    uint256 public listingCount;
    uint256 public constant PLATFORM_FEE = 250; // 2.5% in basis points
    uint256 public constant ROYALTY_FEE = 500; // 5% in basis points
    
    address public feeRecipient;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event Sale(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event ListingCancelled(uint256 indexed listingId);
    event PriceUpdated(uint256 indexed listingId, uint256 newPrice);

    error NotOwner();
    error NotApproved();
    error ListingNotActive();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidPrice();
    error AlreadyListed();

    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }

    /**
     * @dev List an NFT for sale
     */
    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        if (price == 0) revert InvalidPrice();
        
        IERC721 nft = IERC721(nftContract);
        if (nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (!nft.isApprovedForAll(msg.sender, address(this)) && 
            nft.getApproved(tokenId) != address(this)) revert NotApproved();
        
        if (nftToListingId[nftContract][tokenId] != 0) {
            uint256 existingId = nftToListingId[nftContract][tokenId];
            if (listings[existingId].active) revert AlreadyListed();
        }

        listingCount++;
        
        listings[listingCount] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });

        nftToListingId[nftContract][tokenId] = listingCount;

        emit Listed(listingCount, msg.sender, nftContract, tokenId, price);

        return listingCount;
    }

    /**
     * @dev Buy a listed NFT
     */
    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        if (!listing.active) revert ListingNotActive();
        if (msg.value < listing.price) revert InsufficientPayment();

        listing.active = false;

        uint256 platformFee = (listing.price * PLATFORM_FEE) / 10000;
        uint256 royaltyFee = (listing.price * ROYALTY_FEE) / 10000;
        uint256 sellerAmount = listing.price - platformFee - royaltyFee;

        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );

        // Pay platform fee
        (bool feeSuccess, ) = feeRecipient.call{value: platformFee}("");
        if (!feeSuccess) revert TransferFailed();

        // Pay royalty to original creator (seller in this simple version)
        // In production, query the passport contract for original minter
        (bool royaltySuccess, ) = listing.seller.call{value: royaltyFee}("");
        if (!royaltySuccess) revert TransferFailed();

        // Pay seller
        (bool sellerSuccess, ) = listing.seller.call{value: sellerAmount}("");
        if (!sellerSuccess) revert TransferFailed();

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - listing.price}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit Sale(listingId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        if (listing.seller != msg.sender && msg.sender != owner()) revert NotOwner();
        if (!listing.active) revert ListingNotActive();

        listing.active = false;

        emit ListingCancelled(listingId);
    }

    /**
     * @dev Update listing price
     */
    function updatePrice(uint256 listingId, uint256 newPrice) external {
        if (newPrice == 0) revert InvalidPrice();
        
        Listing storage listing = listings[listingId];
        if (listing.seller != msg.sender) revert NotOwner();
        if (!listing.active) revert ListingNotActive();

        listing.price = newPrice;

        emit PriceUpdated(listingId, newPrice);
    }

    /**
     * @dev Get all active listings
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= listingCount; i++) {
            if (listings[i].active) activeCount++;
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= listingCount; i++) {
            if (listings[i].active) {
                activeListings[index] = listings[i];
                index++;
            }
        }

        return activeListings;
    }

    /**
     * @dev Update fee recipient
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        feeRecipient = newRecipient;
    }
}


