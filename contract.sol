// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BursonSkullz is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to declare NFT (Non-Fungible Token) data attributes stored on contract.
    struct NFT {
        uint256 id;         // Unique identifier for the NFT
        uint256 price;      // Price of the NFT in wei (1 ether = 1e18 wei)
        address owner;      // Current owner of the NFT
        uint256 mintDate;   // Date of mint
        string tokenName;   // Token name
        bool forSale;       // Flag indicating if the NFT is for sale
        bool flagged;       // Flag indicating if NFT is suspicous or stolen (pause the sell)
    }

    // Mappings and arrays
    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256[]) private userTokens; // Mapping from user address to array of token IDs owned by the user
    uint256[] private recentSells; // Array to track recent sells

    // Events to track NFT minting, listing for sale, and sale
    event NFTMinted(uint256 id, address owner);
    event NFTForSale(uint256 id, uint256 price);
    event NFTSells(uint256 id, uint256 price, uint256 date);
    
    // State variables to store the owners
    address public contractCreator;
    string public artist;
    address[] internal owners;
    uint256 creatorFee;
    address public walletToReceiveFunds;
    address public RoysWallet;
    uint256 public minimalTransferFee;
    uint256 public minimalListingPrice;
    uint256 private listingFee;

    // constructor called once when code is initially deployed 
    constructor() ERC721("BursonSkullz", "Burson_Skullz") {
        contractCreator = msg.sender; 
        artist = "Roy Burson";
        owners.push(contractCreator);
        creatorFee = 10;
        RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;
        walletToReceiveFunds = RoysWallet;
        minimalTransferFee = 500000000000000000; // in WEI
        minimalListingPrice = 200000000000000000; // in WEI
        listingFee = 200000000000000000; // in WEI 
    }

    function changeMinimalTransferFee(uint256 amountInWEI) external {
        // Only the Owner in the first index (owner[0]) can change the minimal transfer fee 
        require(msg.sender == owners[0], "Privilege denied");
        minimalTransferFee = amountInWEI;
    }

    function checkIfOwner(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function mintNFT(uint256 price) public payable returns (bool) {
        // any owner can mint
        if (!checkIfOwner(msg.sender)) {
            return false;
        } else {
            _tokenIds.increment();  
            uint256 newItemId = _tokenIds.current(); 
            _mint(owners[0], newItemId);  

            nfts[newItemId] = NFT({
                id: newItemId,
                price: price, // price in WEI
                owner: owners[0],
                mintDate: block.timestamp,
                tokenName: "Burson Skull",
                forSale: true, 
                flagged: false    
            });

            userTokens[owners[0]].push(newItemId); // Track ownership
            emit NFTMinted(newItemId, owners[0]);
            return true;
        }
    }

    function mintArrayOfNFTs(NFT[] memory nftArray) external payable returns (bool) {
        // take in token ids and mint each id using sweep ability
        for (uint256 i = 0; i < nftArray.length; i++) {
            if (!mintNFT(nftArray[i].price)) {
                return false;
            }
        }
        return true;
    }

    function listNFT(uint256 tokenId, uint256 userListPrice) external payable {
        // remember to send 15 matic to Roy for listing fee
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(userListPrice >= minimalListingPrice, "Price below minimum listing price");
        payable(walletToReceiveFunds).transfer(minimalTransferFee); // send Roy minimal transfer fee
        nfts[tokenId].forSale = true;
        nfts[tokenId].price = userListPrice;
        emit NFTForSale(tokenId, nfts[tokenId].price);
    }

    function delistNFT(uint256 tokenId) external payable {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can delist the NFT");
        nfts[tokenId].forSale = false;
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        // gets tokenId from index of array which should be identical if increment works correctly
        require(index < _tokenIds.current(), "Index out of bounds");
        uint256 tokenId = _tokenIds.current() - index - 1;
        return tokenId;
    }

    function getAllNFTS() public view returns (NFT[] memory) {
        // returns array of all tokens stored on contract
        uint256 totalTokens = _tokenIds.current();
        NFT[] memory tokens = new NFT[](totalTokens);
        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = tokenByIndex(i);
            tokens[i] = nfts[tokenId];
        }

        return tokens;
    }
    
    function purchaseSingleNFT(uint256 tokenId) payable public returns (bool) {
        // Allows anyone that does not own the token to attempt purchase
        require(msg.value >= nfts[tokenId].price, "Insufficient payment");
        NFT storage nft = nfts[tokenId];
        require(nft.forSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient payment");

        uint256 fee = (nft.price * creatorFee) / 100;
        uint256 ownerShare = nft.price - fee;
        
        // Transfer the creator's fee
        payable(walletToReceiveFunds).transfer(fee);
        // Transfer the remaining amount to the NFT owner
        payable(nft.owner).transfer(ownerShare);
        
        // Transfer the NFT to the buyer
        safeTransferFrom(nft.owner, msg.sender, tokenId);
        
        // Update the NFT details
        nft.owner = msg.sender; // Change the owner after safeTransfer is complete
        nft.forSale = false;

        // Track recent sells
        recentSells.push(tokenId);
        
        // Keep the length of recentSells to a maximum of 1000 items
        if (recentSells.length > 1000) {
            // Remove the first element by shifting all other elements left
            for (uint i = 0; i < recentSells.length - 1; i++) {
                recentSells[i] = recentSells[i + 1];
            }
            // Remove the last element
            recentSells.pop();
        }

        emit NFTSells(tokenId, msg.value, block.timestamp);
        return true;
    }

    function purchaseArrayOfNFT(uint256[] memory tokenIdArray) external payable returns (bool) {
        // meant for sweep function
        uint256 totalCost;
        for (uint256 i = 0; i < tokenIdArray.length; i++) {
            require(nfts[tokenIdArray[i]].forSale, "NFT not for sale");
            totalCost += nfts[tokenIdArray[i]].price;
            require(msg.sender != nfts[tokenIdArray[i]].owner, "Owner cannot purchase own NFT");
        }
        require(msg.value >= totalCost, "Insufficient payment");
        for (uint256 i = 0; i < tokenIdArray.length; i++) {
            purchaseSingleNFT(tokenIdArray[i]);
        }
        return true;
    }

    function checkIfOwnerOfArray(uint256[] memory tokenIdArray) public view returns (bool) {
        // Checks if person is an owner of all tokens passed
        for (uint256 k = 0; k < tokenIdArray.length; k++) {
            if (msg.sender != nfts[tokenIdArray[k]].owner) {
                return false; // Return false immediately if sender doesn't own any token
            }
        }
        return true; 
    }

    function transferSingleNFT(address recipient, uint256 tokenId) payable public returns (bool) {
        // this is for owner of token to transfer to another wallet
        require(msg.value >= minimalTransferFee, "Insufficient payment");
        require(!nfts[tokenId].flagged, "NFT has been flagged; cannot be sold");
        require(nfts[tokenId].forSale, "NFT is not for sale");
        require(msg.sender == nfts[tokenId].owner, "Only owner can transfer NFT");
        payable(walletToReceiveFunds).transfer(minimalTransferFee); // send Roy minimal transfer fee
        safeTransferFrom(msg.sender, recipient, tokenId);
        return true;
    }

    function transferArrayOfNFTS(address recipient, uint256[] memory tokenIdArray) public returns (bool) {
        // meant for owners to transfer array of NFTs that they own to another wallet
        require(checkIfOwnerOfArray(tokenIdArray), "Sender is not owner of one or more NFTs");
        for (uint256 i = 0; i < tokenIdArray.length; i++) {
            transferSingleNFT(recipient, tokenIdArray[i]);
        }
        return true;
    }

    function getMaxSell() public view returns (uint256 maxPrice) {
        maxPrice = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (nfts[i].price > maxPrice) {
                maxPrice = nfts[i].price;
            }
        }
    }

    function getNumberOfTokens() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getRecentSells() public view returns (uint256[] memory) {
        uint256 limit = recentSells.length > 1000 ? 1000 : recentSells.length;
        uint256[] memory sells = new uint256[](limit);
        for (uint256 i = 0; i < limit; i++) {
            sells[i] = recentSells[recentSells.length - i - 1];
        }
        return sells;
    }

    function getUsersTokens(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }

    function checkIfTokenIsAvailable(uint256 tokenId) public view returns (bool) {
        NFT storage nft = nfts[tokenId];
        return !nft.flagged && nft.forSale;
    }
}
