require("dotenv").config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(process.env.MNEMONIC, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`);
            },
            network_id: 3,
            gas: 8000000,
        },
        mainnet: {
            provider: function () {
                return new HDWalletProvider(process.env.MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
            },
            network_id: 1,
            gas: 4000000,
            confirmations: 2,
        },
    },

    contracts_directory: "./src/contracts/",

    contracts_build_directory: "./src/abis/",

    compilers: {
        solc: {
            version: "^0.8.0",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
