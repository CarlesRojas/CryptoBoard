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
    const pixels = useRef([]);
    const coordsToRowCol = (coords) => (numRows < 0 ? null : { row: coords % numRows.current, col: Math.floor(coords / numRows.current) });
    const rowColToCoords = (row, col) => (numRows < 0 ? null : col * numRows.current + row);

    // COLOR PICKER
    const [color, setColor] = useState("#ffffff");

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
                pixels,
                coordsToRowCol,
                rowColToCoords,

                // COLOR PICKER
                color,
                setColor,
            }}
        >
            {children}
        </Data.Provider>
    );
};

export default DataProvider;
