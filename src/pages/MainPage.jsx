import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { Data } from "contexts/Data";

// Components
import CurrentPixel from "components/CurrentPixel";
import Board from "components/Board";

export default function MainPage() {
    // Contexts
    const { loadingDone, pixelLimit, mintedPixels, pixels, color, selectedPixel, coordsToRowCol, getNotMintedColor } = useContext(Data);

    // #################################################
    //   REDIRECT LOGIC
    // #################################################

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Go to landing if not done already
    if (!redirectTo && !loadingDone.current) setRedirectTo("/");

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // #################################################
    //   RENDER
    // #################################################

    // Current pixel already minted
    if (selectedPixel >= 0 && selectedPixel < pixelLimit.current && mintedPixels.current.includes(selectedPixel)) {
        var currPixel = <CurrentPixel owner={pixels.current[selectedPixel].owner} coords={selectedPixel} color={color}></CurrentPixel>;
    }

    // Current pixel not minted
    else if (selectedPixel >= 0 && selectedPixel < pixelLimit.current) {
        const rowCol = coordsToRowCol(selectedPixel);
        currPixel = <CurrentPixel owner={null} coords={selectedPixel} color={getNotMintedColor(rowCol.row, rowCol.col)}></CurrentPixel>;
    }

    // No pixel selected
    else {
        currPixel = <CurrentPixel owner={null} coords={null} color={null}></CurrentPixel>;
    }

    return (
        <div className="mainPage">
            <div className="sidebar">{currPixel}</div>

            <div className="boardContainer">
                <Board />
            </div>
        </div>
    );
}

/* COORDINATE SYSTEM

    numRows = 5
    pixelCount = 25

    0  5  10  15  20
    1  6  11  16  21
    2  7  12  17  22
    3  8  13  18  23
    4  9  14  19  24

    Coords to Row & Col
        row = coords % numRows
        col = floor(coords / numRows)

    Row & Col to Coords
        coords = col * numRows + row
*/
