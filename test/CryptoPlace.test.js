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
            const result0 = await contract.mint(55, "#000000");
            const result1 = await contract.mint(1454, "#FFFFFF", { from: buyer });
            const event0 = result0.logs[0].args;
            const event1 = result1.logs[0].args;
            const mintedPixels0 = await contract.mintedPixels(0);
            const mintedPixels1 = await contract.mintedPixels(1);

            // SUCCESS
            assert.equal(event0.tokenId.toNumber(), 55, "id 1 is correct");
            assert.equal(event0.from, "0x0000000000000000000000000000000000000000", "from 1 is correct");
            assert.equal(event0.to, deployer, "to 1 is correct");
            assert.equal(mintedPixels0.toNumber(), 55, "mintedPixels 1 is correct");
            assert.equal(event1.tokenId.toNumber(), 1454, "id 2 is correct");
            assert.equal(event1.from, "0x0000000000000000000000000000000000000000", "from 2 is correct");
            assert.equal(event1.to, buyer, "to 2 is correct");
            assert.equal(mintedPixels1.toNumber(), 1454, "mintedPixels 2 is correct");

            // FAILURE
            await contract.mint(-1, "#000000").should.be.rejected;
            await contract.mint(55, "#000000").should.be.rejected;
            await contract.mint(55, "#EC0583").should.be.rejected;
            await contract.mint(20, "#EJ0583").should.be.rejected;
            await contract.mint(512 * 512, "#000000").should.be.rejected;
        });

        it("mint a batch of pixels", async () => {
            await contract.mintBatch([10, 5, 4], ["#000000", "#000000", "#00FF00"]);
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
            await contract.mintBatch([57], ["#000000"], { from: buyer }).should.be.rejected;
            await contract.mintBatch([55], ["#000000"]).should.be.rejected;
            await contract.mintBatch([3, 55], ["#000000", "#000000"]).should.be.rejected;
            await contract.mintBatch([123, 435], ["#000000"]).should.be.rejected;
            await contract.mintBatch([123, 435], ["#000000", "#000000", "#000000"]).should.be.rejected;
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
            assert.equal(firstPixel.author, deployer, "first pixel author is correct");
            assert.equal(firstPixel.exists, true, "first pixel exists is correct");
            assert.equal(lastPixel.coords.toNumber(), 4, "last pixel coords are correct");
            assert.equal(lastPixel.color, "#00FF00", "last pixel color is correct");
            assert.equal(lastPixel.author, deployer, "last pixel author is correct");
            assert.equal(lastPixel.exists, true, "last pixel exists is correct");
        });

        it("allows owners to change the color of a pixel", async () => {
            const result = await contract.changeColor(55, "#FFFFFF");
            const event = result.logs[0].args;

            // SUCCESS
            assert.equal(event.coords.toNumber(), 55, "coords are correct");
            assert.equal(event.color, "#FFFFFF", "color is correct");
            assert.equal(event.author, deployer, "author is correct");
            assert.equal(event.exists, true, "exists is correct");

            // FAILURE
            await contract.changeColor(0, "#000000").should.be.rejected;
            await contract.changeColor(55, "#000000", { from: buyer }).should.be.rejected;
            await contract.changeColor(1454, "#FF00FF").should.be.rejected;
            await contract.changeColor(55, "#GGGGGG").should.be.rejected;
            await contract.changeColor(55, "#FFFFFF").should.be.rejected;
        });
    });

    describe("checking auxiliar functions", async () => {
        it("checks that two strings are equal", async () => {
            // SUCCESS
            assert(await contract.stringsAreEqual("#35Aa44", "#35Aa44"));
            assert(await contract.stringsAreEqual("testing", "testing"));
            assert(await contract.stringsAreEqual("", ""));

            // FAILURE
            assert(!(await contract.stringsAreEqual("testing", "not testing")));
            assert(!(await contract.stringsAreEqual("full", "")));
            assert(!(await contract.stringsAreEqual("#3EAa44", "#3GAF44")));
        });

        it("checks that a string is a hex color code", async () => {
            // SUCCESS
            assert(await contract.isColor("#35Aa44"));
            assert(await contract.isColor("#F52344"));
            assert(await contract.isColor("#F52e44"));
            assert(await contract.isColor("#F52e90"));

            // FAILURE
            assert(!(await contract.isColor("35Aa44")));
            assert(!(await contract.isColor("#35Aa744")));
            assert(!(await contract.isColor("#3GAa44")));
            assert(!(await contract.isColor("#35Aay4")));
            assert(!(await contract.isColor(".35Aa44")));
            assert(!(await contract.isColor("#3Aa44")));
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
            await contract.setBaseURI("https://www.uriDomain2.com/").should.be.rejected;
            await contract.tokenURI(0).should.be.rejected;
        });
    });
});
