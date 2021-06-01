// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoPlace is ERC721 {
    // ##################################################################
    //    GLOBAR VARS
    // ##################################################################

    uint256 public numRows;
    uint256 public pixelCount;
    uint256 public pixelLimit;
    uint256[] public mintedPixels;
    mapping(uint256 => Pixel) public pixels;
    address public owner = msg.sender;

    // ##################################################################
    //    STRUCTS
    // ##################################################################

    // Represents a pixel
    struct Pixel {
        uint256 coords;
        string color;
        address payable author;
        bool exists;
    }

    // ##################################################################
    //    MAIN FUNCTIONS
    // ##################################################################

    // Constructor fuunction
    constructor() ERC721("Pixel", "PXL") {
        numRows = 512;
        pixelLimit = 512 * 512;
    }

    // Create a new pixel
    function mint(uint256 _coord, string memory _color) public {
        // Do not create if coordinate already exists
        require(!pixels[_coord].exists);

        // Coords can not be bigger than the pixel limit
        require(_coord < pixelLimit);

        // Only accept valid colors
        require(isColor(_color));

        // Increment the pixel count
        pixelCount++;

        // Mint pixel
        _mint(msg.sender, _coord);

        // Add to minted pixels array
        mintedPixels.push(_coord);

        // Save the pixel
        pixels[_coord] = Pixel(_coord, _color, payable(msg.sender), true);
    }

    // Mint a batch number of coordinates
    function mintBatch(uint256[] memory coordsToMint, string[] memory colors) public onlyBy(owner) {
        // The coords to mint array size has to match the color size
        require(coordsToMint.length == colors.length);

        for (uint i = 0; i < coordsToMint.length; i++) {
            mint(coordsToMint[i], colors[i]);
        }
    }

    // Change the color of a pixel
    function changeColor(uint256 _coord, string memory _color) public {
        // Do not change color if it does not exists
        require(pixels[_coord].exists);

        // Fetch the pixel
        Pixel memory _pixel = pixels[_coord];

        // Check that the owner is correct
        require(_pixel.author == msg.sender);

        // Only accept valid colors
        require(isColor(_color));

        // Check that the color is different than the old one
        require(!stringsAreEqual(_color, _pixel.color));

        // Change color
        _pixel.color = _color;

        // Save pixel
        pixels[_coord] = _pixel;

        // Emit event
        emit PixelColorChanged(
            _pixel.coords,
            _pixel.color,
            _pixel.author,
            _pixel.exists
        );
    }

    // ##################################################################
    //    MODIFIERS
    // ##################################################################

    // Only the owner of the contract can call functions with this modifier
    modifier onlyBy(address _account) {
        require(msg.sender == _account);
        _;
    }

    // ##################################################################
    //    AUX FUNCTIONS
    // ##################################################################

    // Returns true if the strings are equal
    function stringsAreEqual(string memory s1, string memory s2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    // Returns true if the string is a valid HEX color code
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

    // ##################################################################
    //    ADD TOKEN URI
    // ##################################################################

    // Base URI
    string private baseURI;

    // Set a new base uri
    function setBaseURI(string memory baseURI_) public onlyBy(owner) {
        // Check that the color is different than the old one
        require(!stringsAreEqual(baseURI, baseURI_));

        baseURI = baseURI_;
    }

    // Returns the correct base uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // ##################################################################
    //    EVENTS
    // ##################################################################

    // Emited when the color of a pixel changes
    event PixelColorChanged(
        uint256 coords,
        string color,
        address payable author,
        bool exists
    );
}
