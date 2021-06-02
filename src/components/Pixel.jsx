import React, { useContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Icons
import ArrowIcon from "resources/icons/arrow.svg";

export default function Pixel({ pad }) {
    // Contexts
    const { copy } = useContext(Utils);
    const { coordsToRowCol, useDarkMode, color, selectedPixel, setSelectedPixel, numRows, pixelLimit, setColor, setWeiPrice, pixels, getNotMintedColor, notMintedPrice } = useContext(Data);

    // Get row and col
    const rowCol = typeof selectedPixel === "number" ? coordsToRowCol(selectedPixel) : { row: -1, col: -1 };

    // On a directional pad arrow clicked
    const onDirectionalPadClick = (direction) => {
        var newSelectedPixel = -1;
        if (direction === "up" && selectedPixel % numRows.current !== 0) newSelectedPixel = selectedPixel - 1;
        else if (direction === "down" && selectedPixel % numRows.current !== numRows.current - 1) newSelectedPixel = selectedPixel + 1;
        else if (direction === "left" && selectedPixel >= numRows.current) newSelectedPixel = selectedPixel - numRows.current;
        else if (direction === "right" && selectedPixel < pixelLimit.current - numRows.current) newSelectedPixel = selectedPixel + numRows.current;

        if (newSelectedPixel >= 0) {
            const pixelInfo = pixels.current[newSelectedPixel];
            const newRowCol = coordsToRowCol(newSelectedPixel);

            // Set selected pixel
            setSelectedPixel(newSelectedPixel);

            // Set color and price
            if (pixelInfo) {
                setColor(pixelInfo.color);
                setWeiPrice(pixelInfo.weiPrice);
            } else {
                setColor(getNotMintedColor(newRowCol.row, newRowCol.col));
                setWeiPrice(notMintedPrice.current);
            }
        }
    };

    // On directional keys up
    const onKeyUp = (event) => {
        // Return if there is no pixel selected
        if (selectedPixel < 0) return;

        // Move pixel
        if (event.keyCode === "38") onDirectionalPadClick("up");
        else if (event.keyCode === "40") onDirectionalPadClick("down");
        else if (event.keyCode === "37") onDirectionalPadClick("left");
        else if (event.keyCode === "39") onDirectionalPadClick("right");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        // Subscribe to events
        window.addEventListener("keyup", onKeyUp);

        return () => {
            // Unsubscribe from events
            window.removeEventListener("keyup", onKeyUp);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Directional pad
    const directionalPad = pad ? (
        <div className="directionalPad">
            <div className="iconContainer" onClick={() => onDirectionalPadClick("up")}>
                <SVG className={classnames("icon", "up", { dark: useDarkMode })} src={ArrowIcon} />
            </div>

            <div className="iconContainer" onClick={() => onDirectionalPadClick("right")}>
                <SVG className={classnames("icon", "right", { dark: useDarkMode })} src={ArrowIcon} />
            </div>

            <div className="iconContainer" onClick={() => onDirectionalPadClick("left")}>
                <SVG className={classnames("icon", "left", { dark: useDarkMode })} src={ArrowIcon} />
            </div>

            <div className="iconContainer" onClick={() => onDirectionalPadClick("down")}>
                <SVG className={classnames("icon", "down", { dark: useDarkMode })} src={ArrowIcon} />
            </div>
        </div>
    ) : null;

    return (
        <div className="pixel">
            <ReactTooltip place="bottom" type={useDarkMode ? "light" : "dark"} delayShow={100} className="tooltip" />

            <div className={classnames("color", { dark: useDarkMode })} data-tip="click to copy the color HEX code" style={{ backgroundColor: color }} onClick={() => copy(color)}></div>

            <div className="info">
                <div className="row">
                    <p className="name">ROW</p>
                    <p className="coord first">{rowCol.row >= 0 ? rowCol.row : "-"}</p>
                </div>

                <div className="row">
                    <p className="name">COL</p>
                    <p className="coord">{rowCol.row >= 0 ? rowCol.col : "-"}</p>
                </div>
            </div>

            {directionalPad}
        </div>
    );
}
