// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";

/**
    @title An image where each pixel is an NFT
    @author Carles Rojas
    @notice You can use this contract to change the color of your pixels, trade them or mint new ones (Up to a limit).
*/
contract CryptoPlace is ERC721 {
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
        // Coords can not be bigger than the pixel limit
        require(
            _coords < PIXEL_LIMIT,
            "Coordinate for the pixel is out of limits. 0 <= coordinate < 256 * 256"
        );

        // Only accept valid colors
        require(isColor(_color), "Invalid HEX color code. Ej: #FF0000");

        // Mint pixel
        _mint(msg.sender, _coords);

        // Add color and price to the the pixel
        pixels[_coords] = Pixel(
            _coords,
            _color,
            payable(msg.sender),
            _initialWeiPrice
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
        require(
            _coordsToMint.length == _colors.length,
            "The colors array length does not match the coordinates array length."
        );

        // The _coordsToMint array size has to match the _initialWeiPrices array size
        require(
            _coordsToMint.length == _initialWeiPrices.length,
            "The wei prices array length does not match the coordinates array length."
        );

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
        // Do not change color if it does not exist
        require(
            _exists(_coords),
            "Invalid coordinates or the pixel has not yet been minted."
        );

        // Fetch the pixel
        Pixel memory _pixel = pixels[_coords];

        // Check that the owner is correct
        require(
            ownerOf(_coords) == msg.sender,
            "You are not the owner of this pixel."
        );

        // Only accept valid colors
        require(isColor(_color), "Invalid HEX color code. Ej: #FF0000");

        // Check that the color is different than the old one or the price is diferent from the old one
        require(
            !stringsAreEqual(_color, _pixel.color) ||
                _weiPrice != _pixel.weiPrice,
            "The new color and price are the same as the current ones."
        );

        // Change color & price
        _pixel.color = _color;
        _pixel.weiPrice = _weiPrice;

        // Save pixel
        pixels[_coords] = _pixel;
    }

    /**
        @notice Buy a pixel
        @param _coords The coordinates of the pixel to buy: coordinates = column * number_of_rows + row
        @param _color The new color the pixel will have after buying it
        @param _weiPrice The new wei price the pixel will have after buying it
    */
    function buyPixel(
        uint256 _coords,
        string memory _color,
        uint256 _weiPrice
    ) public payable {
        // Do not buy if it does not exist
        require(
            _exists(_coords),
            "Invalid coordinates or the pixel has not yet been minted."
        );

        // Fetch the pixel
        Pixel memory _pixel = pixels[_coords];

        // Check that the owner is not the buyer
        require(
            ownerOf(_coords) != msg.sender,
            "You already are the owner of this pixel."
        );

        // Only accept valid colors
        require(isColor(_color), "Invalid HEX color code. Ej: #FF0000");

        // Price must be higher than the required selling price
        require(
            msg.value >= _pixel.weiPrice,
            "Price is lower than selling price"
        );

        // Transfer fee to owner
        if (transctionFee > 0)
            payable(owner()).transfer((msg.value * transctionFee) / 100);

        // Transfer rest of price to seller
        payable(ownerOf(_coords)).transfer(
            msg.value - ((msg.value * transctionFee) / 100)
        );

        // Transfer pixel to buyer
        _transfer(ownerOf(_coords), msg.sender, _coords);

        // Change color & price
        _pixel.color = _color;
        _pixel.weiPrice = _weiPrice;
        _pixel.owner = payable(msg.sender);

        // Save pixel
        pixels[_coords] = _pixel;
    }

    /**
        @notice Set the new transaction fee for buying a pixel
        @param _newTransactionFee The new base URI
    */
    function setTransctionFee(uint256 _newTransactionFee) public onlyOwner {
        // Check that the Transaction Fee is different than the old one
        require(
            transctionFee != _newTransactionFee,
            "The new transaction fee is the same as the current one."
        );

        transctionFee = _newTransactionFee;
    }
}
