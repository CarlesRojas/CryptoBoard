import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import classnames from "classnames";

// Contexts
import { Data } from "contexts/Data";

// Components
import OwnedPixel from "components/OwnedPixel";
import NotMintedPixel from "components/NotMintedPixel";
import NotSelectedPixel from "components/NotSelectedPixel";
import NotOwnedPixel from "components/NotOwnedPixel";
import Minting from "components/Minting";
import Buying from "components/Buying";
import MyPixels from "components/MyPixels";
import Board from "components/Board";

export default function MainPage() {
    // Contexts
    const { loadingDone, pixelLimit, mintedPixels, pixels, selectedPixel, useDarkMode, account, minting, buying } = useContext(Data);

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

    // Pixel info
    const pixelInfo = pixels.current && selectedPixel >= 0 && selectedPixel < pixelLimit.current ? pixels.current[selectedPixel] : null;

    // No pixel selected
    if (selectedPixel < 0 || selectedPixel >= pixelLimit.current) var currSidebarComponent = <NotSelectedPixel />;
    // Owned Pixel
    else if (selectedPixel >= 0 && selectedPixel < pixelLimit.current && mintedPixels.current.includes(selectedPixel) && pixelInfo.owner === account) currSidebarComponent = <OwnedPixel />;
    // Not Owned Pixel
    else if (selectedPixel >= 0 && selectedPixel < pixelLimit.current && mintedPixels.current.includes(selectedPixel) && !buying) currSidebarComponent = <NotOwnedPixel />;
    // Buying Pixel
    else if (selectedPixel >= 0 && selectedPixel < pixelLimit.current && mintedPixels.current.includes(selectedPixel)) currSidebarComponent = <Buying />;
    // Not Minted Pixel
    else if (!minting) currSidebarComponent = <NotMintedPixel />;
    // Minting Pixel
    else currSidebarComponent = <Minting />;

    return (
        <div className="mainPage">
            <div className="sidebar">
                <div className={classnames("section", { dark: useDarkMode })}>{currSidebarComponent}</div>
                <div className={classnames("section", "second", { dark: useDarkMode })}>{<MyPixels />}</div>
            </div>

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
