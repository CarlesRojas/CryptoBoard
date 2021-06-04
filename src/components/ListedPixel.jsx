import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import Web3 from "web3";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

export default function ListedPixel({ mintedPixel }) {
    // Contexts
    const { copy } = useContext(Utils);
    const { pixels, coordsToRowCol, useDarkMode, color, selectedPixel, setSelectedPixel, setColor, setEthPrice, setMinting, setBuying, setColorPickerIsValid, setEthPriceIsValid } = useContext(Data);

    // PixelInfo
    const pixelInfo = pixels.current[mintedPixel];

    // Get row and col
    const rowCol = typeof mintedPixel === "number" ? coordsToRowCol(mintedPixel) : { row: -1, col: -1 };

    // Select this pixel
    const selectThisPixel = () => {
        setSelectedPixel(mintedPixel);
        setColor(pixelInfo.color.toLowerCase());
        setEthPrice(Web3.utils.fromWei(pixelInfo.weiPrice.toString(), "Ether").toString());

        // Cancel minting or buying
        setMinting(false);
        setBuying(false);
        setColorPickerIsValid(true);
        setEthPriceIsValid(true);
    };

    // #################################################
    //   RENDER
    // #################################################

    // Get color
    const currColor = mintedPixel === selectedPixel ? color : pixelInfo.color;

    return (
        <div className={classnames("listedPixel", { dark: useDarkMode }, { selected: mintedPixel === selectedPixel })}>
            <ReactTooltip place="bottom" type={useDarkMode ? "light" : "dark"} delayShow={100} className="tooltip" />

            <div
                className={classnames("color", "small", { dark: useDarkMode })}
                data-tip="click to copy the color HEX code"
                style={{ backgroundColor: currColor }}
                onClick={() => copy(currColor)}
            ></div>

            <div className="info" data-tip="click to select this pixel" onClick={selectThisPixel}>
                <div className="row">
                    <p className="name">ROW</p>
                    <p className="coord first">{rowCol.row >= 0 ? rowCol.row : "-"}</p>
                    <p className="x">x</p>
                    <p className="coord">{rowCol.row >= 0 ? rowCol.col : "-"}</p>
                    <p className="name">COL</p>
                </div>
            </div>
        </div>
    );
}
