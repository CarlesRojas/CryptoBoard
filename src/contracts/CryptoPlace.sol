// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
    @title An image where each pixel is an NFT
    @author Carles Rojas
    @notice You can use this contract to change the color of your pixels, trade them or mint new ones (Up to a limit).
*/
contract CryptoPlace is ERC721, Ownable, Pausable {
    // ##################################################################
    //    GLOBAR VARS
    // ##################################################################

    uint256 public constant NUM_ROWS = 256;
    uint256 public constant PIXEL_LIMIT = NUM_ROWS * NUM_ROWS;
    uint256 public pixelCount;
    uint256[] public mintedPixels;
    mapping(uint256 => Pixel) public pixels;

    // ##################################################################
    //    STRUCTS
    // ##################################################################

    /**
        @notice Represents a pixel. With coordinates, color, owner, wei price and whether it has been minted
    */
    struct Pixel {
        uint256 coords;
        string color;
        address payable owner;
        uint256 weiPrice;
        bool exists;
    }

    // ##################################################################
    //    MAIN FUNCTIONS
    // ##################################################################

    /**
        @notice The constructor for the CryptoPlace contract
    */
    constructor() ERC721("Pixel", "PXL") {}

    /**
        @notice Create a new pixel.
        @param _coords The coordinates of the pixel being minted: coordinates = column * number_of_rows + row
        @param _color The color the pixel will have once minted
        @param _initialWeiPrice The selling price the pixel will have after being minted in wei
    */
    function mint(
        uint256 _coords,
        string memory _color,
        uint256 _initialWeiPrice
    ) public {
        // Do not create if coordinate already exists
        require(!pixels[_coords].exists, "Pixel has already been minted.");

        // Coords can not be bigger than the pixel limit
        require(_coords < PIXEL_LIMIT, "Coordinate for the pixel is out of limits. 0 <= coordinate < 256 * 256");

        // Only accept valid colors
        require(isColor(_color), "Invalid HEX color code. Ej: #FF0000");

        // Increment the pixel count
        pixelCount++;

        // Mint pixel
        _mint(msg.sender, _coords);

        // Add to minted pixels array
        mintedPixels.push(_coords);

        // Save the pixel
        pixels[_coords] = Pixel(
            _coords,
            _color,
            payable(msg.sender),
            _initialWeiPrice,
            true
        );
    }

    /**
        @notice Create a batch of pixels
        @param _coordsToMint An array of pixel  coordinates to be minted: coordinates = column * number_of_rows + row
        @param _colors An array with colors for each pixel being minted
        @param _initialWeiPrices An array with initial prices in wei for each pixel being minted
    */
    function mintBatch(
        uint256[] memory _coordsToMint,
        string[] memory _colors,
        uint256[] memory _initialWeiPrices
    ) public onlyOwner {
        // The _coordsToMint array size has to match the _colors array size
        require(_coordsToMint.length == _colors.length, "The colors array length does not match the coordinates array length.");

        // The _coordsToMint array size has to match the _initialWeiPrices array size
        require(_coordsToMint.length == _initialWeiPrices.length, "The wei prices array length does not match the coordinates array length.");

        for (uint256 i = 0; i < _coordsToMint.length; i++) {
            mint(_coordsToMint[i], _colors[i], _initialWeiPrices[i]);
        }
    }

    /**
        @notice Change the color and / or selling price of a pixel
        @param _coords The coordinates of the pixel: coordinates = column * number_of_rows + row
        @param _color The new color the pixel will have
        @param _weiPrice The new wei price the pixel will have
    */
    function changeColorAndPrice(
        uint256 _coords,
        string memory _color,
        uint256 _weiPrice
    ) public {
        // Do not change color if it does not exists
        require(pixels[_coords].exists, "Invalid coordinates. Out of limits or the pixel has not yet been minted.");

        // Fetch the pixel
        Pixel memory _pixel = pixels[_coords];

        // Check that the owner is correct
        require(_pixel.owner == msg.sender, "You are not the owner of this pixel.");

        // Only accept valid colors
        require(isColor(_color), "Invalid HEX color code. Ej: #FF0000");

        // Check that the color is different than the old one or the price is diferent from the old one
        require(
            !stringsAreEqual(_color, _pixel.color) ||
                _weiPrice != _pixel.weiPrice, "The new color and price are the same as the current ones."
        );

        // Change color & price
        _pixel.color = _color;
        _pixel.weiPrice = _weiPrice;

        // Save pixel
        pixels[_coords] = _pixel;
    }

    // ##################################################################
    //    ADD TOKEN URI
    // ##################################################################

    // Base URI
    string private baseURI;

    /**
        @notice Set the new base URI for all the pixels
        @param baseURI_ The new base URI
    */
    function setBaseURI(string memory baseURI_) public onlyOwner {
        // Check that the color is different than the old one
        require(!stringsAreEqual(baseURI, baseURI_), "The new base URI is the same as the current one,");

        baseURI = baseURI_;
    }

    /**
        @notice Get the base URI for the pixels
        @return Returns the base URI for the pixels
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // ##################################################################
    //    AUX FUNCTIONS
    // ##################################################################

    /**
        @notice Checks if two strings are equal
        @param _s1 The first string to compare
        @param _s2 The second string to compare
        @return True if the strings are equal
    */
    function stringsAreEqual(string memory _s1, string memory _s2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(_s1)) ==
            keccak256(abi.encodePacked(_s2));
    }

    /**
        @notice Checks if a color is a valid HEX color code
        @param _color The HEX color code to check
        @return True if the string is a valid HEX color code
    */
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
}
