import React, { createContext, useContext } from "react";
import Web3 from "web3";
import CryptoBoard from "abis/CryptoBoard.json";

// Contexts
import { Data } from "contexts/Data";

// API Context
export const API = createContext();

const APIProvider = ({ children }) => {
    // Contexts
    const { account, networkID, networkInfo, contract, numRows, pixelCount, pixels } = useContext(Data);

    // Load web3, the main eth account & the smart contract
    const load = async () => {
        try {
            if (window.ethereum) {
                // Load Web3
                await window.ethereum.request({ method: "eth_requestAccounts" });
                window.web3 = new Web3(window.ethereum);

                // Load accounts
                const accounts = await window.web3.eth.getAccounts();
                if (accounts.length <= 0) return "no-eth-accounts";
                account.current = accounts[0];

                // Get network ID, the adress and the abi
                networkID.current = await window.web3.eth.net.getId();
                networkInfo.current = CryptoBoard.networks[networkID.current];
                if (!networkInfo.current) return "contract-not-deployed";

                // Load smart contract
                contract.current = new window.web3.eth.Contract(CryptoBoard.abi, networkInfo.current.address);

                // Success
                return "success";
            }
            // Not an Ethereum Browser
            return "non-eth-browser";
        } catch (error) {
            // User has rejected the connection
            if ("code" in error && error.code === 4001) return "user-reject";
            // There is a request pending
            else if ("code" in error && error.code === -32002) return "request-pending";
            // Unknown Error
            else {
                console.log(error);
                return "unknown-error";
            }
        }
    };

    // Get the total number of rows
    const getNumRows = async () => {
        // Return if the contract has not been loaded
        if (!contract.current) return;

        // Return if we have already fetched it
        if (numRows.current >= 0) return numRows.current;

        try {
            numRows.current = await contract.current.methods.numRows().call();
            return numRows.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get the total number of pixels
    const getPixelCount = async () => {
        // Return if the contract has not been loaded
        if (!contract.current) return;

        // If we do not have the number of rows, get it
        if (numRows.current < 0) await getNumRows();

        // Return if we have already fetched it
        if (pixelCount.current >= 0) return pixelCount.current;

        try {
            pixelCount.current = await contract.current.methods.pixelCount().call();
            return pixelCount.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get all the pixels
    const getPixels = async () => {
        // Return if the contract has not been loaded
        if (!contract.current) return [];

        // If we do not have the pixel count, get it
        if (pixelCount.current < 0) await getPixelCount();

        try {
            // Load pixels
            pixels.current = [];
            for (let i = 0; i < pixelCount.current; i++) {
                const currPixel = await contract.current.methods.pixels(i).call();
                pixels.current = [...pixels.current, currPixel];
            }

            return pixels.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Change color of a pixel
    const changePixelColor = async (coord, newColor) => {
        // Return if the contract has not been loaded
        if (!contract.current) return [];

        // If we do not have the pixels get the
        if (pixels.current.length <= 0) await getPixels();

        try {
            // Change pixel color
            await contract.current.methods.changeColor(coord, newColor).send({ from: account.current });

            // Update pixels
            pixels.current[coord]["1"] = newColor;
            pixels.current[coord]["color"] = newColor;
        } catch (error) {
            console.log(error);
        }
    };

    // Return the context
    return (
        <API.Provider
            value={{
                load,
                getNumRows,
                getPixelCount,
                getPixels,
                changePixelColor,
            }}
        >
            {children}
        </API.Provider>
    );
};

export default APIProvider;
