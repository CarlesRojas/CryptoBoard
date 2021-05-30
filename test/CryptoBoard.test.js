const CryptoBoard = artifacts.require("./CryptoBoard.sol");

// Import Chai
require("chai").use(require("chai-as-promised")).should();

// Testing
contract("CryptoBoard", ([deployer, buyer]) => {
    let contract;

    before(async () => {
        contract = await CryptoBoard.deployed();
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
            const result = await contract.mint(0, "#000000");
            const event = result.logs[0].args;

            // SUCCESS
            assert.equal(event.tokenId.toNumber(), 0, "id is correct");
            assert.equal(event.from, "0x0000000000000000000000000000000000000000", "from is correct");
            assert.equal(event.to, deployer, "to is correct");

            // FAILURE
            await contract.mint(0, "#000000").should.be.rejected;
            await contract.mint(0, "#EC0583").should.be.rejected;
            await contract.mint(1, "#EJ0583").should.be.rejected;
            await contract.mint(1, "#E20583", { from: buyer }).should.be.rejected;
        });

        it("lists pixels", async () => {
            const pixelCount = await contract.pixelCount();
            const pixel = await contract.pixels(pixelCount.toNumber() - 1);

            // SUCCESS
            assert.equal(pixel.coords.toNumber(), pixelCount.toNumber() - 1, "coords are correct");
            assert.equal(pixel.color, "#000000", "color is correct");
            assert.equal(pixel.author, deployer, "author is correct");
            assert.equal(pixel.exists, true, "exists is correct");
        });

        it("allows owners to change the color of a pixel", async () => {
            const result = await contract.changeColor(0, "#FFFFFF");
            const event = result.logs[0].args;

            // SUCCESS
            assert.equal(event.coords.toNumber(), 0, "coords are correct");
            assert.equal(event.color, "#FFFFFF", "color is correct");
            assert.equal(event.author, deployer, "author is correct");
            assert.equal(event.exists, true, "exists is correct");

            // FAILURE
            await contract.changeColor(1, "#000000").should.be.rejected;
            await contract.changeColor(0, "#000000", { from: buyer }).should.be.rejected;
            await contract.changeColor(0, "#GGGGGG").should.be.rejected;
            await contract.changeColor(0, "#FFFFFF").should.be.rejected;
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
});
