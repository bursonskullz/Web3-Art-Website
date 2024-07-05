// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BursonSkullz is ERC721 {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to decalre NFT (Non-Fungible Token) data attributes stored on contract.
    struct NFT {
        uint256 id;         // Unique identifier for the NFT
        string image;       // Image associated with the NFT (IPFS hash or URL)
        uint256 price;      // Price of the NFT in wei (1 ether = 1e18 wei)
        address owner;      // Current owner of the NFT
        uint256 mintDate;   // Date of mint
        string tokenName;   // Token name
        bool forSale;       // Flag indicating if the NFT is for sale
    }
    // Mapping from token ID to NFT struct
    mapping(uint256 => NFT) public nfts;

    // Events to track NFT minting, listing for sale, and sale
    event NFTMinted(uint256 id, address owner);
    event NFTForSale(uint256 id, uint256 price);
    
    // State variables to store the owners
    address public contractCreator;
    string public artist;
    address[] internal owners;
    uint256 creatorFee;
    address public walletToReceiveFunds;
    address public RoysWallet;
    uint256 public minimalTransferFee;
    uint256 public minimalListingPrice;

    // constructor called once when code is initially deployed 
    constructor() ERC721("BursonSkullz", "Burson_Skullz") {
        contractCreator = msg.sender; 
        artist = "Roy Burson";
        owners.push(contractCreator);
        creatorFee = 10;
        RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;
        walletToReceiveFunds = RoysWallet;
        minimalTransferFee = 500000000000000000; 
        minimalListingPrice = 200000000000000000;
    }

    function changeMinimalTransferFee(uint256 amountInWEI) external {
        // Only the Owner in the first index (owner[0] can change the minimal transfer Fee 
        require(msg.sender == owners[0], "privelage denied yo");
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

    function mintNFT(uint256 price, string memory _image) public payable returns (bool) {
        // any owner can mint
        if(checkIfOwner(msg.sender) == false){
            return false;
        }else{
            _tokenIds.increment();  
            uint256 newItemId = _tokenIds.current(); 
            _mint(owners[0], newItemId);  

            nfts[newItemId] = NFT({
                id: newItemId,
                image: _image, 
                price: price, // price in WEI a uint256 (1Eth = 10^18 WEI)
                owner: owners[0],
                mintDate: block.timestamp,
                tokenName: "Burson Skull",
                forSale: true    
            });

            emit NFTMinted(newItemId, owners[0]);
            return true;
        }
    }

    function mintArrayOfNFTs(NFT[] memory nftArray) external payable returns (bool){
        for(uint256 i= 0; i < nftArray.length; i++){
            // will mint until it returns false but should not unless msg.sender changes at any point in loop
            if(!mintNFT(nftArray[i].price, nftArray[i].image)){
                return false;
            }
        }
        return true;
    }

    function listNFT(uint256 tokenId, uint256 userListPrice) external payable {
        // dev allows only owner to list for cost of gas
        // recall transaction is signed before function is called and metamask gets a response from solidity
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(userListPrice >= minimalListingPrice, "Sorry floor cannot go under minimal listing price");
        nfts[tokenId].forSale = true;
        nfts[tokenId].price = userListPrice;
        emit NFTForSale(tokenId, nfts[tokenId].price);
    }

    function delistNFT(uint256 tokenId) external payable {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can delist the NFT");
        nfts[tokenId].forSale = false;
        // do not reset price it will just be whatever was the last set price
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
        uint256 fee = nft.price * (creatorFee/100);
        uint256 ownerShare = nft.price - fee;
        payable(walletToReceiveFunds).transfer(fee);
        payable(nft.owner).transfer(ownerShare);
        safeTransferFrom(nft.owner, msg.sender, tokenId);
        nft.owner = msg.sender;
        nft.forSale = false;
        return true;
    }
    function purchaseArrayOfNFT(uint256[] memory tokenIdArray) external payable returns (bool){
        // Allows anyone to purchase array of tokens that are not owned by them
        uint256 totalCost;
        totalCost = 0;
        for(uint256 i=0; i<tokenIdArray.length; i++ ){
            if(!nfts[tokenIdArray[i]].forSale){
                return false;
            }
        }
        for(uint256 i=0; i<tokenIdArray.length; i++ ){
            totalCost = totalCost + nfts[tokenIdArray[i]].price;
            if(msg.sender == nfts[tokenIdArray[i]].owner){
                return false;
            }
        }
        require(msg.value >= totalCost, "Insufficient payment");
        for(uint256 i=0; i<tokenIdArray.length; i++ ){
            purchaseSingleNFT(tokenIdArray[i]);
        }
        return true;
    }
    function checkIfOwnerOfArray(uint256[] memory tokenIdArray) public view returns (bool) {
        //Checks if person is an owner of all tokens passed
        for (uint256 k = 0; k < tokenIdArray.length; k++) {
            if (msg.sender != nfts[tokenIdArray[k]].owner) {
                return false; // Return false immediately if sender doesn't own any token
            }
        }
        return true; 
    }

    function transferSingleNFT(address recipient, uint256 tokenId) payable public returns (bool){
        // Transfers a single NFT if minimal value is met
        require(msg.value >= minimalTransferFee, "Insufficient payment");
        if(msg.sender == nfts[tokenId].owner){
            payable(walletToReceiveFunds).transfer(minimalTransferFee);
            safeTransferFrom(msg.sender, recipient, tokenId);
            return true;
        }else{
            return false;
        }
    }

    function transferArrayOfNFTS(address recipient, uint256[] memory tokenIdArray) public payable returns (bool) {
        // Transfers array of NFTs if minimal value is met
        if (checkIfOwnerOfArray(tokenIdArray)) {
            payable(walletToReceiveFunds).transfer(minimalTransferFee); 
            for (uint256 k = 0; k < tokenIdArray.length; k++) {
                safeTransferFrom(msg.sender, recipient, tokenIdArray[k]);
            }
            return true;
        } else {
            return false;
        }
    }

    function changeCreatorFee(uint256 newPercent) external returns(bool){
        // Allows address in owners[0] position to change the creator fee only if it is less than 20%
        require(newPercent <= 20);
        for(uint k = 0; k< owners.length; k++){
            if(msg.sender == owners[k]){
                creatorFee = newPercent;
                return true;
            }
        }
        return false;
    } 

    function addOwner(address newOwner) external returns (bool){
        // Allows any address in Owners to add another owner 
        for(uint k = 0; k< owners.length; k++){
            if(msg.sender == owners[k]){
                owners.push(newOwner);
                return true;
            }
        }
        return false;
    }

    function removeOwner(uint256 index) external returns (bool) {
        // Allows only Owner[0] to remove other Owners
        require(msg.sender == owners[0] && owners.length >= 2, "Only the owner in the first index can change wallet address");
        require(index < owners.length && index != 0, "Index out of bounds or trying to remove owner in first index");
        address[] memory newOwners = new address[](owners.length - 1);

        for (uint256 i = 0; i < index; i++) {
            newOwners[i] = owners[i];
        }
        for (uint256 i = index + 1; i < owners.length; i++) {
            newOwners[i - 1] = owners[i];
        }
        owners = newOwners;
        return true;
    }

    function changeWalletToRecieveFunds(address newWalletProvider) external returns(bool) {
        //Allows Owner[0] to change wallet that recieves the funds 
        require(msg.sender == owners[0], "Error only owner in the first index of contract can change wallet address");
        walletToReceiveFunds = newWalletProvider;
        return true;
    }
}
