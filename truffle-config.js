require("dotenv").config();
var HDWalletProvider = require("truffle-hdwallet-provider");

const Web3 = require("web3");
const web3 = new Web3();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
            gasPrice: web3.utils.toWei("5", "gwei"),
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
            gas: 14000000,
            gasPrice: web3.utils.toWei("5", "gwei"),
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
