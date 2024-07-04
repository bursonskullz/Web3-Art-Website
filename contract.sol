// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BursonSkullz is ERC721 {
 // Using Counters for managing token IDs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to represent an NFT (Non-Fungible Token)
    struct NFT {
        uint256 id;         // Unique identifier for the NFT
        string image;       // Image associated with the NFT (IPFS hash or URL)
        uint256 price;      // Price of the NFT in wei (1 ether = 1e18 wei)
        uint256 decimalPlaces;
        address owner;      // Current owner of the NFT
        uint256 mintDate;
        string tokenName;
        bool forSale;       // Flag indicating if the NFT is for sale
    }
    // Mapping from token ID to NFT struct
    mapping(uint256 => NFT) public nfts;

    // Events to track NFT minting, listing for sale, and sale
    event NFTMinted(uint256 id, address owner);
    event NFTForSale(uint256 id, uint256 price);
    event NFTSold(uint256 id, address buyer, uint256 price);
    
    // State variables to store the owners
    address public contractCreator;
    string public artist;
    address[] internal owners;
    uint256 creatorFee;
    address public walletToReceiveFunds;
    address public RoysWallet;

    constructor() ERC721("BursonSkullz", "Burson_Skullz") {
        contractCreator = msg.sender; // sets creator to whoever calls the constructor (or initialized the contract)
        artist = "Roy Burson";
        owners.push(contractCreator);
        creatorFee = 10;
        RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;
        walletToReceiveFunds = RoysWallet;
    }
    function checkIfOwner(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _address) {
                return true;
            }
        }
        return false;
    }
    // Function to mint a new NFT
    function mintNFT(uint256 price, string memory _image, uint decimalPoints) public returns (bool) {
        if(checkIfOwner(msg.sender) == false){
            // not okay to send transaction 
            // cannot find owner
            return false;
        }else{
            // add to array and return true
            _tokenIds.increment();  // Increment token ID counter
            uint256 newItemId = _tokenIds.current();  // Get the current token ID
            _mint(owners[0], newItemId);  // Mint the new token to the recipient

            // Create a new NFT and store it in the mapping.
            nfts[newItemId] = NFT({
                id: newItemId,
                image: _image,      
                price: price, // price in integer with decimals moved
                decimalPlaces: decimalPoints, // real price is price/10^decimals as solidity doesnt have decimals.
                owner: owners[0],
                mintDate: block.timestamp,
                tokenName: "Burson Skull",
                forSale: true    
            });

            // Emit an event to signify that a new NFT has been minted
            emit NFTMinted(newItemId, owners[0]);
            return true;
        }
    }

    function mintArrayOfNFTs(NFT[] memory nftArray) external returns (bool){
        for(uint256 i= 0; i < nftArray.length; i++){
            if(!mintNFT(nftArray[i].price, nftArray[i].image , nftArray[i].decimalPlaces)){
                return false;
            }
        }
        return true;
    }

    function listNFT(uint256 tokenId) external {
        // modifiying blockchain causes gas fees so they will need to approve transaction with gas!
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        nfts[tokenId].forSale = true;
        emit NFTForSale(tokenId, nfts[tokenId].price);
    }

    function delistNFT(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can delist the NFT");
        nfts[tokenId].forSale = false;
    }
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < _tokenIds.current(), "Index out of bounds");

        // Iterate backwards to get token IDs
        uint256 tokenId = _tokenIds.current() - index - 1;
        return tokenId;
    }
    function getAllNFTS() public view returns (NFT[] memory) {
        uint256 totalTokens = _tokenIds.current();
        NFT[] memory tokens = new NFT[](totalTokens);

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = tokenByIndex(i);
            tokens[i] = nfts[tokenId];
        }

        return tokens;
    }
    
    function transferSingleNFT(address recipient, uint256 tokenId) payable public returns (bool){
        if(msg.sender == nfts[tokenId].owner){
            uint256 fee = msg.value / creatorFee;
            payable(ownerOf(tokenId)).transfer(msg.value - fee);
            payable(walletToReceiveFunds).transfer(fee);
            safeTransferFrom(msg.sender, recipient, tokenId);
            return true;
        }else{
            return false;
        }
    }
    function checkIfOwnerOfArray(uint256[] memory tokenIdArray) public view returns (bool) {
        for (uint256 k = 0; k < tokenIdArray.length; k++) {
            if (msg.sender != nfts[tokenIdArray[k]].owner) {
                return false; // Return false immediately if sender doesn't own any token
            }
        }
        return true; // Return true if sender owns all tokens in the array
    }

    function transferArrayOfNFTS(address recipient, uint256[] memory tokenIdArray) public returns (bool) {
        if (checkIfOwnerOfArray(tokenIdArray)) {
            for (uint256 k = 0; k < tokenIdArray.length; k++) {
                safeTransferFrom(msg.sender, recipient, tokenIdArray[k]);
            }
            return true;
        } else {
            return false;
        }
    }
    function changeCreatorFee(uint256 newPercent) external returns(bool){
        for(uint k = 0; k< owners.length; k++){
            if(msg.sender == owners[k]){
                creatorFee = newPercent;
                return true;
            }
        }
        return false;
        
    } 

    function addOwner(address newOwner) external returns (bool){
        for(uint k = 0; k< owners.length; k++){
            if(msg.sender == owners[k]){
                owners.push(newOwner);
                return true;
            }
        }
        return false;
    }
    function changeWalletToRecieveFunds(address newWalletProvider) external returns(bool) {
        require(msg.sender == owners[0], "Error only owner in the first index of contract can change wallet address");
        walletToReceiveFunds = newWalletProvider;
        return true;
    }
}
