// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoBoard is ERC721 {
    // General info
    uint256 public pixelCount;

    // Mappings
    mapping(uint256 => Pixel) public _pixels;

    address public owner = msg.sender;

    struct Pixel {
        uint256 id;
        string color;
        address payable author;
        bool exists;
    }

    constructor() ERC721("Pixel", "PXL") {}

    modifier onlyBy(address _account) {
        require(msg.sender == _account);
        _;
    }

    function isColor(string memory _color) public pure returns (bool) {
        // String to bytes
        bytes memory b = bytes(_color);

        // Not correct length
        if (b.length != 7) return false;

        // First charater must be '#'
        if (b[0] != 0x23) return false;

        // Other characters have to be 1-9 or A-F or a-f
        for (uint256 i = 1; i < b.length; i++) {
            bytes1 char = b[i];

            if (
                !(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x46) && // A-F
                !(char >= 0x61 && char <= 0x66) // a-f
            ) return false;
        }

        // String is a color hex value
        return true;
    }

    function mint(uint256 _coord, string memory _color) public onlyBy(owner) {
        // Do not create if coordinate already exists
        require(!_pixels[_coord].exists);

        // Only accept valid colors
        require(isColor(_color));

        // Increment the pixel count
        pixelCount++;

        // Mint pixel
        _mint(msg.sender, _coord);

        // Save the pixel
        _pixels[_coord] = Pixel(_coord, _color, payable(msg.sender), true);
    }

    function changeColor(uint256 _coord, string memory _color) public {}
}
