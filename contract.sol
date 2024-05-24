// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


struct TokenMetadata {
    string name;
    string details;
    string price; // keep as string in sol and convert to int data type in client side javascript because sol doesnt have type. 
    bool forSale; // Boolean variable to indicate if the token is for sale
}

contract MyNFT is ERC721, Ownable { // put contract here all functions!

    mapping(uint256 => TokenMetadata) private _tokenMetadata;
    uint256 private _currentTokenId = 0;
    address private _roy;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        _roy = msg.sender; // Set the address of "roy" during contract deployment
    }

    modifier onlyRoy() {
        require(msg.sender == _roy, "Only Roy can call this function");
        _;
    }

    function mint(address to, string memory name, string memory details, bool forSale, uint256 price) public onlyRoy {
        uint256 tokenId = _getNextTokenId();
        _safeMint(to, tokenId);
        _setTokenMetadata(tokenId, name, details, forSale, price);
    }

    function setRoy(address newRoy) public onlyOwner {
        _roy = newRoy;
    }

    function getTokenMetadata(uint256 tokenId) public view returns (string memory name, string memory details) {
        return (_tokenMetadata[tokenId].name, _tokenMetadata[tokenId].details);
    }

    function _getNextTokenId() private returns (uint256) {
        _currentTokenId++;
        return _currentTokenId;
    }

    function _setTokenMetadata(uint256 tokenId, string memory name, string memory details) private {
        _tokenMetadata[tokenId] = TokenMetadata(name, details);
    }
}