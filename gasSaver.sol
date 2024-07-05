// SPDX-License-Identifier: MIT
// meant to save collection as buffer string and save gas will use in later collections if useful and aceeptable by community 

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BursonSkullz is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Struct to represent an NFT (Non-Fungible Token)
    struct NFT {
        uint256 id;             // Unique identifier for the NFT
        string image;           // Image associated with the NFT (IPFS hash or URL)
        uint256 price;          // Price of the NFT in wei (1 ether = 1e18 wei)
        uint256 decimalPlaces;  // Additional data for the NFT
        address owner;          // Current owner of the NFT
        uint256 mintDate;       // Date when the NFT was minted
        string tokenName;       // Name of the NFT
        bool forSale;           // Flag indicating if the NFT is for sale
    }

    // Mapping from token ID to NFT struct
    mapping(uint256 => NFT) public nfts;

    // State variables for contract management
    address public contractCreator;
    string public artist;
    address[] internal owners;
    uint256 creatorFee;
    address public walletToReceiveFunds;
    address public RoysWallet;
    string public nftTokenJsonString;
    bool public nftTokensHaveBeenMinted;

    constructor() ERC721("BursonSkullz", "Burson_Skullz") {
        contractCreator = msg.sender;
        artist = "Roy Burson";
        owners.push(contractCreator);
        creatorFee = 10;  // 10% creator fee
        RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;
        walletToReceiveFunds = RoysWallet;
    }

    // Function to check if an address is an owner
    function checkIfOwner(address _address) internal view returns (bool) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _address) {
                return true;
            }
        }
        return false;
    }

    // Function to mint NFTs based on a JSON string
    function mintJsonNFTString(string memory jsonStringofTokens) public returns (bool) {
        require(checkIfOwner(msg.sender) && !nftTokensHaveBeenMinted, "Not authorized or tokens already minted");
        nftTokenJsonString = jsonStringofTokens;
        nftTokensHaveBeenMinted = true;
        
        return true;
    }

    function transferToken(uint256 tokenID, address recipient) external  returns (bool){
        // anyone can initiate tranfer if they send payment to owner and it is listed for sale
        // first check if token attribute forSale is true (inside the nftTokenJsonString string)
        // not using array to save gas do not create data 
        // if true get current price 
        // send current price to owner minus the creator fee 
        // send creator fee to walletTogetFunds
        // grab owner inside string from nftTokenJsonString that starts with tokenID 
        // check if msg.sender is equal to the owner

    }
}
