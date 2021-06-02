import React, { useContext, useState, useRef, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Utils } from "contexts/Utils";
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Components
import ColorPicker from "components/ColorPicker";

// Icons
import UndoIcon from "resources/icons/undo.svg";
import LoadingIcon from "resources/icons/loading.svg";

export default function CurrentPixel({ color, coords, owner }) {
    // Contexts
    const { copy, getMostContrastedColor } = useContext(Utils);
    const { changePixelColorAndPrice, mint } = useContext(API);
    const { pixels, pixelLimit, coordsToRowCol, useDarkMode, setColor, selectedPixel, account } = useContext(Data);

    // Columns and rows
    const rowCol = typeof coords === "number" ? coordsToRowCol(coords) : { row: -1, col: -1 };

    // Pixel
    const pixelInfo = pixels.current[coords];

    // #################################################
    //   FUNCTIONS
    // #################################################

    // Saving
    const [saving, setSaving] = useState(false);

    // Minting
    const [minting, setMinting] = useState(false);

    // Error Message
    const [errorMessage, setErrorMessage] = useState("");

    // Save color to blockchain
    const saveColor = async () => {
        // Only if it is a valid pixel
        if (typeof coords === "number" && coords >= 0 && coords < pixelLimit.current && color) {
            setSaving(true);

            // Save color
            const colorSaved = await changePixelColorAndPrice(coords, color);

            // Inform about the color change
            if (colorSaved) window.PubSub.emit("changePixelColorAndPrice", { pixelCoords: coords, newColor: color });
            // Show Error
            else setErrorMessage("Pixel was not saved");

            setSaving(false);
        }
    };

    // Reset pixel to blockchain color ROJAS
    const resetColor = () => {
        // Only if it is a valid pixel
        if (pixelInfo && color) {
            // Get original color
            const origColor = pixelInfo.color;
            setColor(origColor);
        }
    };

    // Mint the pixel
    const mintPixel = async () => {
        // Only if it is a valid pixel
        if (typeof selectedPixel === "number" && selectedPixel >= 0 && selectedPixel < pixelLimit.current) {
            setMinting(true);

            // Mint pixel ROJAS ADD COLOR AND PRICE FROM THE SELECTOR
            const pixelMinded = await mint(coords, "#ffffff", 1);

            // Inform about the color change
            if (pixelMinded) window.PubSub.emit("colorPriceChanged", { pixelCoords: coords, newColor: "#ffffff", newWeiPrice: 1 });
            // Show Error
            else setErrorMessage("Pixel was not minted");

            setMinting(false);
        }
    };

    // Timeout
    const showErrorTimeout = useRef(null);

    // Remove error message after 2 seconds
    useEffect(() => {
        if (showErrorTimeout.current) clearTimeout(showErrorTimeout.current);

        if (errorMessage)
            showErrorTimeout.current = setTimeout(() => {
                setErrorMessage("");
            }, 3000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        return () => {
            // Clear timeouts
            if (showErrorTimeout.current) clearTimeout(showErrorTimeout.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Save Button
    var saveButton =
        pixelInfo && color.toLowerCase() !== pixelInfo.color.toLowerCase() && !errorMessage && owner !== null && owner === account ? (
            <React.Fragment>
                <div className={classnames("button", { dark: useDarkMode })} onClick={saveColor} style={{ backgroundColor: color, color: getMostContrastedColor(color, "white", "black") }}>
                    {saving ? <SVG className={classnames("loadingIcon", { dark: useDarkMode })} src={LoadingIcon} style={{ color: getMostContrastedColor(color, "white", "black") }} /> : "SAVE"}
                </div>
                <div className={classnames("button", "icon", { dark: useDarkMode })} onClick={resetColor}>
                    <SVG className={classnames("undoIcon", { dark: useDarkMode })} src={UndoIcon} />
                </div>
            </React.Fragment>
        ) : null;

    // Mint Button
    var mintButton = !errorMessage ? (
        <div className={classnames("button", { dark: useDarkMode })} onClick={mintPixel}>
            {minting ? <SVG className={classnames("loadingIcon", { dark: useDarkMode })} src={LoadingIcon} /> : "MINT"}
        </div>
    ) : null;

    // No pixel selected message
    var noPixelSelected = typeof coords !== "number" && !errorMessage ? <p className="message">Select a pixel to change its color</p> : null;

    // Pixel not owned message
    var pixelNotOwned = !errorMessage && owner !== null && owner !== account ? <p className="message">You don't own this pixel</p> : null;

    // No pixel selected message
    var errorMessageText = errorMessage ? <p className="message error">{errorMessage}</p> : null;

    // Minted pixel
    if (owner || (owner === null && coords === null)) {
        var bottomSection = (
            <React.Fragment>
                <p className="account" data-tip="click to copy" onClick={() => copy(owner)}>
                    {owner}
                </p>

                <ColorPicker></ColorPicker>

                <div className="lower">
                    {saveButton}
                    {noPixelSelected}
                    {errorMessageText}
                    {pixelNotOwned}
                </div>
            </React.Fragment>
        );
    }

    // Not minted pixel
    else if (coords !== null) {
        bottomSection = (
            <React.Fragment>
                <div className="mint">
                    <p className="message">This pixel has not yet been minted.</p>
                    <p className="message">Get it for only the price of gas.</p>
                    <p className="message">You will own it and be able to change its color.</p>

                    <div className="money">
                        <p className="value">0</p>
                        <p className="unit">ETH</p>
                    </div>
                    <p className="message small">+ GAS</p>

                    <div className="lower">
                        {mintButton}
                        {errorMessageText}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className={classnames("currentPixel", { dark: useDarkMode })}>
            <ReactTooltip place="bottom" type={useDarkMode ? "dark" : "light"} className="tooltip" />

            <p className="title">Selected Pixel</p>

            <div className="main">
                <div className={classnames("color", { dark: useDarkMode })} style={{ backgroundColor: color }}></div>

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
            </div>

            {bottomSection}
        </div>
    );
}
