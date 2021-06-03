import React, { createContext, useRef, useState, useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // Contexts
    const { setCookie } = useContext(Utils);

    // LOADING CHECK
    const loadingDone = useRef(false);

    // DARK MODE
    const [useDarkMode, setUseDarkMode] = useState(false);
    const setDarkMode = (darkMode) => {
        // Set the dark mode
        if (darkMode) document.body.classList.add("dark");
        else document.body.classList.remove("dark");

        // Save it in a cookie
        setCookie("cryptoplace_dark_mode", darkMode ? 1 : 0);

        // Set the state
        setUseDarkMode(darkMode);
    };

    // ERROR
    const errorType = useRef("");

    // ETHEREUM INFO
    const [account, setAccount] = useState("");
    const networkID = useRef("");
    const networkInfo = useRef({});
    const contract = useRef("");

    // PIXELS INFO
    const numRows = useRef(-1);
    const pixelCount = useRef(-1);
    const pixelLimit = useRef(-1);
    const mintedPixels = useRef(null);
    const pixels = useRef(null);
    const coordsToRowCol = (coords) => (numRows < 0 ? null : { row: coords % numRows.current, col: Math.floor(coords / numRows.current) });
    const rowColToCoords = (row, col) => (numRows < 0 ? null : col * numRows.current + row);

    // SELECTED PIXEL INFO
    const [selectedPixel, setStateSelectedPixel] = useState(-1);
    const currSelectedPixel = useRef(-1);
    const setSelectedPixel = (newSelectedPixel) => {
        currSelectedPixel.current = newSelectedPixel;
        setStateSelectedPixel(newSelectedPixel);
    };

    // COLOR PICKER
    const [color, setColor] = useState("#ffffff");
    const [colorPickerIsValid, setColorPickerIsValid] = useState(true);
    const getNotMintedColor = (row, col) => ((row + col) % 2 === 0 ? "#ededed" : "#e5e5e5");

    // PRICE
    const [ethPrice, setEthPrice] = useState("0.005");
    const [ethPriceIsValid, setEthPriceIsValid] = useState(true);
    const notMintedPrice = useRef("0.005");

    // ACTION
    const [minting, setMinting] = useState(false);
    const [buying, setBuying] = useState(false);

    // #################################################
    //   PROVIDE DATA
    // #################################################

    return (
        <Data.Provider
            value={{
                // LOADING CHECK
                loadingDone,

                //DARK MODE
                useDarkMode,
                setDarkMode,

                // ERROR
                errorType,

                // ETHEREUM INFO
                account,
                setAccount,
                networkID,
                networkInfo,
                contract,

                // PIXELS INFO
                numRows,
                pixelCount,
                pixelLimit,
                mintedPixels,
                pixels,
                coordsToRowCol,
                rowColToCoords,
                selectedPixel,
                currSelectedPixel,
                setSelectedPixel,

                // COLOR PICKER
                color,
                setColor,
                colorPickerIsValid,
                setColorPickerIsValid,
                getNotMintedColor,

                // PRICE
                ethPrice,
                setEthPrice,
                ethPriceIsValid,
                setEthPriceIsValid,
                notMintedPrice,

                // ACTION
                minting,
                setMinting,
                buying,
                setBuying,
            }}
        >
            {children}
        </Data.Provider>
    );
};

export default DataProvider;
