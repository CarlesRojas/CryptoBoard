import React, { createContext, useRef } from "react";

// Data Context
export const Data = createContext();

const DataProvider = ({ children }) => {
    // LOADING CHECK
    const loadingDone = useRef(false);

    //   ERROR
    const errorType = useRef("");

    // ETHEREUM INFO
    const account = useRef("");
    const networkID = useRef("");
    const networkInfo = useRef({});
    const contract = useRef("");

    // PIXELS INFO
    const numRows = useRef(-1);
    const pixelCount = useRef(-1);
    const pixels = useRef([]);

    // #################################################
    //   PROVIDE DATA
    // #################################################

    return (
        <Data.Provider
            value={{
                // LOADING CHECK
                loadingDone,

                // ERROR
                errorType,

                // ETHEREUM INFO
                account,
                networkID,
                networkInfo,
                contract,

                // PIXELS INFO
                numRows,
                pixelCount,
                pixels,
            }}
        >
            {children}
        </Data.Provider>
    );
};

export default DataProvider;
