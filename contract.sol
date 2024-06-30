// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BursonSkullz is ERC721 {
 // Using Counters for managing token IDs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

     // Roy's wallet address
    address RoysWallet = 0x5CdaD7876270364242Ade65e8e84655b53398B76;

    // Struct to represent an NFT (Non-Fungible Token)
    struct NFT {
        uint256 id;         // Unique identifier for the NFT
        string image;       // Image associated with the NFT (IPFS hash or URL)
        uint256 price;      // Price of the NFT in wei (1 ether = 1e18 wei)
        address owner;      // Current owner of the NFT
        bool forSale;       // Flag indicating if the NFT is for sale
    }
    // Mapping from token ID to NFT struct
    mapping(uint256 => NFT) public nfts;

    // Events to track NFT minting, listing for sale, and sale
    event NFTMinted(uint256 id, address owner);
    event NFTForSale(uint256 id, uint256 price);
    event NFTSold(uint256 id, address buyer, uint256 price);
    // Constructor to initialize the ERC721 token
    constructor() ERC721("BursonSkullz", "Burson_Skullz") {}

    // Function to mint a new NFT
    function mintNFT(address recipient, uint256 price, string memory _image) external returns (bool) {
        // returns true if able to mint and and false otherwise so javascript can handle
        if(msg.sender != RoysWallet){
            // not okay to send transaction
            return false;
        }else{
            // add to array and return true
            _tokenIds.increment();  // Increment token ID counter
            uint256 newItemId = _tokenIds.current();  // Get the current token ID
            _mint(recipient, newItemId);  // Mint the new token to the recipient

            // Create a new NFT and store it in the mapping
            nfts[newItemId] = NFT({
                id: newItemId,
                image: _image,      
                price: price,
                owner: recipient,
                forSale: true    
            });

            // Emit an event to signify that a new NFT has been minted
            emit NFTMinted(newItemId, recipient);
            return true;
        }
    }

    function listNFT(uint256 tokenId) external {
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
    function getAllTokens() public view returns (NFT[] memory) {
        uint256 totalTokens = _tokenIds.current();
        NFT[] memory tokens = new NFT[](totalTokens);

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = tokenByIndex(i);
            tokens[i] = nfts[tokenId];
        }

        return tokens;
    }
}
