const CryptoPlace = artifacts.require("./CryptoPlace.sol");

// Import Chai
require("chai").use(require("chai-as-promised")).should();

// Testing
contract("CryptoPlace", ([deployer, buyer]) => {
    let contract;

    before(async () => {
        contract = await CryptoPlace.deployed();
    });

    describe("deployment", async () => {
        it("deploys successfully", async () => {
            const address = contract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("has a name", async () => {
            const name = await contract.name();
            assert.equal(name, "Pixel");
        });

        it("has a symbol", async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, "PXL");
        });
    });

    describe("pixels", async () => {
        it("mints a new pixel", async () => {
            const result0 = await contract.mint(55, "#000000", web3.utils.toWei("5", "Ether"));
            const result1 = await contract.mint(1454, "#FFFFFF", web3.utils.toWei("10", "Ether"), { from: buyer });
            const event0 = result0.logs[0].args;
            const event1 = result1.logs[0].args;
            const mintedPixels0 = await contract.mintedPixels(0);
            const mintedPixels1 = await contract.mintedPixels(1);
            const pixel0 = await contract.pixels(mintedPixels0);
            const pixel1 = await contract.pixels(mintedPixels1);
            const numRows = await contract.NUM_ROWS();

            // SUCCESS
            assert.equal(event0.tokenId.toNumber(), 55, "id 1 is correct");
            assert.equal(event0.from, "0x0000000000000000000000000000000000000000", "from 1 is correct");
            assert.equal(event0.to, deployer, "to 1 is correct");
            assert.equal(mintedPixels0.toNumber(), 55, "mintedPixels 1 is correct");
            assert.equal(pixel0.coords.toNumber(), 55, "pixel 0 coords are correct");
            assert.equal(pixel0.color, "#000000", "pixel 0 color is correct");
            assert.equal(pixel0.owner, deployer, "pixel 0 owner is correct");
            assert.equal(pixel0.weiPrice, web3.utils.toWei("5", "Ether"), "pixel 0 price is correct");
            assert.equal(pixel0.exists, true, "pixel 0 exists is correct");

            assert.equal(event1.tokenId.toNumber(), 1454, "id 2 is correct");
            assert.equal(event1.from, "0x0000000000000000000000000000000000000000", "from 2 is correct");
            assert.equal(event1.to, buyer, "to 2 is correct");
            assert.equal(mintedPixels1.toNumber(), 1454, "mintedPixels 2 is correct");
            assert.equal(pixel1.coords.toNumber(), 1454, "pixel 1 coords are correct");
            assert.equal(pixel1.color, "#FFFFFF", "pixel 1 color is correct");
            assert.equal(pixel1.owner, buyer, "pixel 1 owner is correct");
            assert.equal(pixel1.weiPrice, web3.utils.toWei("10", "Ether"), "pixel 1 price is correct");
            assert.equal(pixel1.exists, true, "pixel 1 exists is correct");

            // FAILURE
            await contract.mint(-1, "#000000", 1).should.be.rejected; // Coords < 0
            await contract.mint(numRows * numRows, "#000000", 1).should.be.rejected; // Coords >= limit
            await contract.mint(55, "#000000", 1).should.be.rejected; // Coords already minted
            await contract.mint(1, "#EJ0583", 1).should.be.rejected; // Invalid color
        });

        it("mint a batch of pixels", async () => {
            await contract.mintBatch([10, 5, 4], ["#000000", "#000000", "#00FF00"], [1, 2, 3]);
            const pixelCount = await contract.pixelCount();
            const mintedPixels2 = await contract.mintedPixels(2);
            const mintedPixels3 = await contract.mintedPixels(3);
            const mintedPixels4 = await contract.mintedPixels(4);

            // SUCCESS
            assert.equal(pixelCount, 5, "all pixels minted correctly");
            assert.equal(mintedPixels2, 10, "minted pixel 2 i correct");
            assert.equal(mintedPixels3, 5, "minted pixel 2 i correct");
            assert.equal(mintedPixels4, 4, "minted pixel 2 i correct");

            // FAILURE
            await contract.mintBatch([57], ["#000000"], [1], { from: buyer }).should.be.rejected; // Only owner can execute this function
            await contract.mintBatch([55], ["#000000"], [1]).should.be.rejected; // The coords are already minted
            await contract.mintBatch([3, 55], ["#000000", "#000000"], [1, 2]).should.be.rejected; // At least one of the coords are already minted
            await contract.mintBatch([123, 435], ["#000000"], [1, 2]).should.be.rejected; // Colors array size < coords array size
            await contract.mintBatch([123, 435], ["#000000", "#000000", "#000000"]).should.be.rejected; // Colors array size > coords array size
            await contract.mintBatch([123, 435], ["#000000", "#000000"], [1]).should.be.rejected; // Wei prices array size < coords array size
            await contract.mintBatch([123, 435], ["#000000", "#000000"], [1, 2, 3]).should.be.rejected; // Wei prices array size < coords array size
        });

        it("lists pixels", async () => {
            const pixelCount = await contract.pixelCount();
            const mintedPixels0 = await contract.mintedPixels(0);
            const mintedPixels1 = await contract.mintedPixels(pixelCount - 1);
            const firstPixel = await contract.pixels(mintedPixels0);
            const lastPixel = await contract.pixels(mintedPixels1);

            // SUCCESS
            assert.equal(firstPixel.coords.toNumber(), 55, "first pixel coords are correct");
            assert.equal(firstPixel.color, "#000000", "first pixel color is correct");
            assert.equal(firstPixel.owner, deployer, "first pixel owner is correct");
            assert.equal(firstPixel.weiPrice, web3.utils.toWei("5", "Ether"), "first pixel price is correct");
            assert.equal(firstPixel.exists, true, "first pixel exists is correct");

            assert.equal(lastPixel.coords.toNumber(), 4, "last pixel coords are correct");
            assert.equal(lastPixel.color, "#00FF00", "last pixel color is correct");
            assert.equal(lastPixel.owner, deployer, "last pixel owner is correct");
            assert.equal(lastPixel.weiPrice, 3, "last pixel price is correct");
            assert.equal(lastPixel.exists, true, "last pixel exists is correct");
        });

        it("allows owners to change the color and/or wei price of a pixel", async () => {
            await contract.changeColorAndPrice(55, "#FFFFFF", web3.utils.toWei("20", "Ether")); // Change both color and wei price
            await contract.changeColorAndPrice(10, "#FFFFFF", 1); // Change only color
            await contract.changeColorAndPrice(5, "#000000", 5); // Change only  wei price
            await contract.changeColorAndPrice(1454, "#000000", web3.utils.toWei("20", "Ether"), { from: buyer }); // Different account change
            const pixel0 = await contract.pixels(55);
            const pixel1 = await contract.pixels(10);
            const pixel2 = await contract.pixels(5);
            const pixel3 = await contract.pixels(1454);

            // SUCCESS
            assert.equal(pixel0.coords.toNumber(), 55, "coords 0 are correct");
            assert.equal(pixel0.color, "#FFFFFF", "color 0 is correct");
            assert.equal(pixel0.owner, deployer, "owner 0 is correct");
            assert.equal(pixel0.weiPrice, web3.utils.toWei("20", "Ether"), "price 0 is correct");
            assert.equal(pixel0.exists, true, "exists 0 is correct");

            assert.equal(pixel1.coords.toNumber(), 10, "coords 1 are correct");
            assert.equal(pixel1.color, "#FFFFFF", "color 1 is correct");
            assert.equal(pixel1.owner, deployer, "owner 1 is correct");
            assert.equal(pixel1.weiPrice, 1, "price 1 is correct");
            assert.equal(pixel1.exists, true, "exists 1 is correct");

            assert.equal(pixel2.coords.toNumber(), 5, "coords 2 are correct");
            assert.equal(pixel2.color, "#000000", "color 2 is correct");
            assert.equal(pixel2.owner, deployer, "owner 2 is correct");
            assert.equal(pixel2.weiPrice, 5, "price 2 is correct");
            assert.equal(pixel2.exists, true, "exists 2 is correct");

            assert.equal(pixel3.coords.toNumber(), 1454, "coords 3 are correct");
            assert.equal(pixel3.color, "#000000", "color 3 is correct");
            assert.equal(pixel3.owner, buyer, "owner 3 is correct");
            assert.equal(pixel3.weiPrice, web3.utils.toWei("20", "Ether"), "price 3 is correct");
            assert.equal(pixel3.exists, true, "exists 3 is correct");

            // FAILURE
            await contract.changeColorAndPrice(0, "#000000", 1).should.be.rejected; // Pixel has not been minted
            await contract.changeColorAndPrice(55, "#000000", 1, { from: buyer }).should.be.rejected; // Not the owner of the pixel
            await contract.changeColorAndPrice(1454, "#FF00FF", 1).should.be.rejected; // Not the owner of the pixel
            await contract.changeColorAndPrice(55, "#GGGGGG", 1).should.be.rejected; // Invalid Color
            await contract.changeColorAndPrice(55, "#FFFFFF", web3.utils.toWei("20", "Ether")).should.be.rejected; // No changes
        });
    });

    describe("checking auxiliar functions", async () => {
        it("checks that two strings are equal", async () => {
            // SUCCESS
            assert(await contract.stringsAreEqual("#35Aa44", "#35Aa44")); // Equal
            assert(await contract.stringsAreEqual("testing", "testing")); // Equal
            assert(await contract.stringsAreEqual("", "")); // Equal empty strings

            // FAILURE
            assert(!(await contract.stringsAreEqual("testing", "not testing"))); // Different strings
            assert(!(await contract.stringsAreEqual("full", ""))); // One is empty
            assert(!(await contract.stringsAreEqual("#3EAa44", "#3GAF44"))); // Different colors
        });

        it("checks that a string is a hex color code", async () => {
            // SUCCESS
            assert(await contract.isColor("#35Aa44")); // Valid Hex color codes
            assert(await contract.isColor("#F52344")); // Valid Hex color codes
            assert(await contract.isColor("#F52e44")); // Valid Hex color codes
            assert(await contract.isColor("#F52e90")); // Valid Hex color codes

            // FAILURE
            assert(!(await contract.isColor("35Aa44"))); // No #
            assert(!(await contract.isColor("#35Aa744"))); // Too many numers
            assert(!(await contract.isColor("#3Aa44"))); // Too few numers
            assert(!(await contract.isColor("#3GAa44"))); // Invalid Hex numer
            assert(!(await contract.isColor("#35Aay4"))); // Invalid Hex numer
            assert(!(await contract.isColor(".35Aa44"))); // . instead of #
        });
    });

    describe("setting token URI", async () => {
        it("sets token uri correctly", async () => {
            await contract.setBaseURI("https://www.uriDomain1.com/");
            await contract.setBaseURI("https://www.uriDomain2.com/");
            const result0 = await contract.tokenURI(55);
            const result1 = await contract.tokenURI(1454);

            // SUCCESS
            assert.equal(result0, "https://www.uriDomain2.com/55", "tokenURI 1 is correct");
            assert.equal(result1, "https://www.uriDomain2.com/1454", "tokenURI 2 is correct");

            // FAILURE
            await contract.setBaseURI("https://www.uriDomain2.com/").should.be.rejected; // Change to the same domain
            await contract.tokenURI(0).should.be.rejected; // Get token uri of a non existing token
        });
    });
});
