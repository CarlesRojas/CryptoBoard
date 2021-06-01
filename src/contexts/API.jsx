import React, { createContext, useContext } from "react";
import Web3 from "web3";
import CryptoPlace from "abis/CryptoPlace.json";

// Contexts
import { Data } from "contexts/Data";

// API Context
export const API = createContext();

const APIProvider = ({ children }) => {
    const { account, setAccount, networkID, networkInfo, contract, numRows, pixelCount, pixelLimit, mintedPixels, pixels, setSelectedPixel, currSelectedPixel, setColor } = useContext(Data);

    // Load web3, the main eth account & the smart contract
    const load = async () => {
        console.log("LOAD");

        try {
            if (window.ethereum) {
                // Load Web3
                await window.ethereum.request({ method: "eth_requestAccounts" });
                window.web3 = new Web3(window.ethereum);

                // Load accounts
                const accounts = await window.web3.eth.getAccounts();
                if (accounts.length <= 0) return "no-eth-accounts";
                setAccount(accounts[0]);

                // Get network ID, the adress and the abi
                networkID.current = await window.web3.eth.net.getId();
                networkInfo.current = CryptoPlace.networks[networkID.current];
                if (!networkInfo.current) return "contract-not-deployed";

                // Load smart contract
                contract.current = new window.web3.eth.Contract(CryptoPlace.abi, networkInfo.current.address);

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

    // Mint a pixel
    const mint = async (coords) => {
        console.log("MINT PIXEL");

        // Return if not a correct coord
        if (typeof coords !== "number" || (coords < 0 && coords >= pixelLimit.current)) return;

        try {
            await contract.current.methods.mint(coords, "#ffffff").send({ from: account });

            // Update minted pixels array
            mintedPixels.current.push(coords);

            // Update pixel
            pixels.current[coords] = {
                0: coords.toString(),
                1: "#ffffff",
                2: account,
                3: true,
                coords: coords.toString(),
                color: "#ffffff",
                author: account,
                exists: true,
            };

            // Set selected pixel
            setSelectedPixel(coords);
            currSelectedPixel.current = coords;
            setColor("#ffffff");

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    // Get the total number of rows
    const getNumRows = async () => {
        console.log("GET NUM ROWS");

        // Return if the contract has not been loaded
        if (!contract.current) return;

        // Return if we have already fetched it
        if (numRows.current >= 0) return numRows.current;

        try {
            const result = await contract.current.methods.numRows().call();
            numRows.current = parseInt(result);
            return numRows.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get the total number of pixels
    const getPixelCount = async () => {
        console.log("GET PIXEL COUNT");

        // Return if the contract has not been loaded
        if (!contract.current) return;

        // If we do not have the number of rows, get it
        if (numRows.current < 0) await getNumRows();

        // Return if we have already fetched it
        if (pixelCount.current >= 0) return pixelCount.current;

        try {
            const value = await contract.current.methods.pixelCount().call();
            pixelCount.current = parseInt(value);
            return pixelCount.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get the limit number of pixels
    const getPixelLimit = async () => {
        console.log("GET PIXEL LIMIT");

        // Return if the contract has not been loaded
        if (!contract.current) return;

        // Return if we have already fetched it
        if (pixelLimit.current >= 0) return pixelLimit.current;

        try {
            const value = await contract.current.methods.pixelLimit().call();
            pixelLimit.current = parseInt(value);
            return pixelLimit.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get the coords of the minted pixels
    const getMintedPixels = async () => {
        console.log("GET MINTED PIXELS");

        // Return if the contract has not been loaded
        if (!contract.current) return;

        // Return if we have already fetched it
        if (mintedPixels.current !== null) return mintedPixels.current;

        // If we do not have the pixel count, get it
        if (pixelCount.current < 0) await getPixelCount();

        try {
            // Save as numbers
            mintedPixels.current = [];
            for (let i = 0; i < pixelCount.current; i++) {
                const value = await contract.current.methods.mintedPixels(i).call();
                mintedPixels.current.push(parseInt(value));
            }
            return mintedPixels.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Get all the pixels
    const getPixels = async () => {
        console.log("GET PIXELS");

        // Return if the contract has not been loaded
        if (!contract.current) return [];

        // Return if we have already fetched it
        if (pixels.current !== null) return pixels.current;

        // If we do not have the pixel count, get it
        if (pixelLimit.current < 0) await getPixelLimit();

        // If we do not have the minted pixels, get them
        if (mintedPixels.current === null) await getMintedPixels();

        try {
            // Load pixels
            pixels.current = [];
            for (let i = 0; i < pixelLimit.current; i++) {
                if (mintedPixels.current.includes(i)) {
                    const currPixel = await contract.current.methods.pixels(i).call();
                    pixels.current.push(currPixel);
                } else pixels.current.push(null);
            }

            return pixels.current;
        } catch (error) {
            console.log(error);
        }
    };

    // Change color of a pixel
    const changePixelColor = async (coord, newColor) => {
        console.log("CHANGE PIXEL COLOR");

        // Return if the contract has not been loaded
        if (!contract.current) return [];

        // If we do not have the pixels get the
        if (pixels.current.length <= 0) await getPixels();

        try {
            // Change pixel color
            await contract.current.methods.changeColor(coord, newColor).send({ from: account });

            // Update pixels
            pixels.current[coord]["1"] = newColor.toLowerCase();
            pixels.current[coord]["color"] = newColor.toLowerCase();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    // Return the context
    return (
        <API.Provider
            value={{
                load,
                mint,
                getNumRows,
                getPixelCount,
                getPixelLimit,
                getMintedPixels,
                getPixels,
                changePixelColor,
            }}
        >
            {children}
        </API.Provider>
    );
};

export default APIProvider;
