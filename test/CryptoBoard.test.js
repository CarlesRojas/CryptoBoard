const CryptoBoard = artifacts.require("./CryptoBoard.sol");

// Import Chai
require("chai").use(require("chai-as-promised")).should();

// Testing
contract("CryptoBoard", (accounts) => {
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

    describe("checking color", async () => {
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

    describe("minting", async () => {
        it("creates a new token", async () => {
            const result = await contract.mint(0, "#EC058E");
            const event = result.logs[0].args;

            // SUCCESS
            assert.equal(event.tokenId.toNumber(), 0, "id is correct");
            assert.equal(event.from, "0x0000000000000000000000000000000000000000", "from is correct");
            assert.equal(event.to, accounts[0], "to is correct");

            // FAILURE: cannot mint same coords twice
            await contract.mint(0, "#EC058E").should.be.rejected;
            await contract.mint(0, "#EC0583").should.be.rejected;
            await contract.mint(1, "#EJ0583").should.be.rejected;
        });
    });

});
