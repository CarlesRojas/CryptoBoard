import React, { useContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import Web3 from "web3";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Icons
import ArrowIcon from "resources/icons/arrow.svg";

export default function Pixel({ pad }) {
    // Contexts
    const { copy } = useContext(Utils);
    const {
        coordsToRowCol,
        useDarkMode,
        color,
        selectedPixel,
        currSelectedPixel,
        setSelectedPixel,
        numRows,
        pixelLimit,
        setColor,
        setEthPrice,
        pixels,
        getNotMintedColor,
        notMintedPrice,
        setMinting,
        setBuying,
        setColorPickerIsValid,
        setEthPriceIsValid,
    } = useContext(Data);

    // Get row and col
    const rowCol = typeof selectedPixel === "number" ? coordsToRowCol(selectedPixel) : { row: -1, col: -1 };

    // On a directional pad arrow clicked
    const onDirectionalPadClick = (direction) => {
        var newSelectedPixel = -1;
        if (direction === "up" && currSelectedPixel.current % numRows.current !== 0) newSelectedPixel = currSelectedPixel.current - 1;
        else if (direction === "down" && currSelectedPixel.current % numRows.current !== numRows.current - 1) newSelectedPixel = currSelectedPixel.current + 1;
        else if (direction === "left" && currSelectedPixel.current >= numRows.current) newSelectedPixel = currSelectedPixel.current - numRows.current;
        else if (direction === "right" && currSelectedPixel.current < pixelLimit.current - numRows.current) newSelectedPixel = currSelectedPixel.current + numRows.current;

        if (newSelectedPixel >= 0) {
            const pixelInfo = pixels.current[newSelectedPixel];
            const newRowCol = coordsToRowCol(newSelectedPixel);

            // Set selected pixel
            setSelectedPixel(newSelectedPixel);

            // Set color and price
            if (pixelInfo) {
                setColor(pixelInfo.color);
                setEthPrice(Web3.utils.fromWei(pixelInfo.weiPrice.toString(), "Ether").toString());
            } else {
                setColor(getNotMintedColor(newRowCol.row, newRowCol.col));
                setEthPrice(notMintedPrice.current);
                setMinting(false);
                setBuying(false);
                setColorPickerIsValid(true);
                setEthPriceIsValid(true);
            }
        }
    };

    // On directional keys up
    const onKeyDown = (event) => {
        // Return if there is no pixel selected
        if (currSelectedPixel.current < 0) return;

        // Return if we are in an input element
        if (event.target.tagName === "INPUT") return;

        // Move pixel
        if (event.code === "ArrowUp") onDirectionalPadClick("up");
        else if (event.code === "ArrowDown") onDirectionalPadClick("down");
        else if (event.code === "ArrowLeft") onDirectionalPadClick("left");
        else if (event.code === "ArrowRight") onDirectionalPadClick("right");
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        // Subscribe to events
        window.addEventListener("keydown", onKeyDown);

        return () => {
            // Unsubscribe from events
            window.removeEventListener("keydown", onKeyDown);
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
