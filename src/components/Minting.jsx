import React, { useContext, useState, useRef, useEffect } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Data } from "contexts/Data";
import { API } from "contexts/API";

// Components
import Pixel from "components/Pixel";
import ColorPicker from "components/ColorPicker";
import PricePicker from "components/PricePicker";

// Icons
import LoadingIcon from "resources/icons/loading.svg";
import UndoIcon from "resources/icons/undo.svg";

export default function Minting() {
    // Contexts
    const { useDarkMode, selectedPixel, pixelLimit, color, coordsToRowCol, setColor, ethPrice, setEthPrice, notMintedPrice, getNotMintedColor, colorPickerIsValid, ethPriceIsValid } = useContext(Data);
    const { mint } = useContext(API);

    // #################################################
    //   RESET
    // #################################################

    // Reset pixel to blockchain color
    const resetColorAndPrice = () => {
        // Get row and col
        const rowCol = coordsToRowCol(selectedPixel);

        // Set Color and Price
        setColor(getNotMintedColor(rowCol.row, rowCol.col));
        setEthPrice(notMintedPrice.current);
    };

    // #################################################
    //   ERROR MESSAGE
    // #################################################

    // Error Message
    const [errorMessage, setErrorMessage] = useState("");

    // Timeout
    const showErrorTimeout = useRef(null);

    // Remove error message after 2 seconds
    useEffect(() => {
        if (showErrorTimeout.current) clearTimeout(showErrorTimeout.current);

        if (errorMessage) showErrorTimeout.current = setTimeout(() => setErrorMessage(""), 2000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage]);

    // #################################################
    //   MINTING
    // #################################################

    // Minting
    const [loading, setLoading] = useState(false);

    // Mint the pixel
    const mintPixel = async () => {
        // Return if not a valid input (color or price)
        if (!colorPickerIsValid || !ethPriceIsValid) return;

        // Only if it is a valid pixel
        if (typeof selectedPixel === "number" && selectedPixel >= 0 && selectedPixel < pixelLimit.current) {
            setLoading(true);

            // Mint pixel
            const pixelMinded = await mint(selectedPixel, color, ethPrice);

            // Inform about the color change
            if (pixelMinded) window.PubSub.emit("changePixelColorAndPrice", { pixelCoords: selectedPixel, newColor: color, newEthPrice: ethPrice });
            // Show Error
            else {
                setErrorMessage("Pixel was not minted");
                setLoading(false);
            }
        }
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        return () => {
            // Clear timeouts
            if (showErrorTimeout.current) clearTimeout(showErrorTimeout.current);
            setLoading(false);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Mint Button
    var buttons = !errorMessage ? (
        <div className="buttonsContainer">
            <div className={classnames("button", { dark: useDarkMode }, { invalid: !colorPickerIsValid || !ethPriceIsValid })} onClick={mintPixel}>
                {loading ? <SVG className={classnames("loadingIcon", { dark: useDarkMode })} src={LoadingIcon} /> : "MINT"}
            </div>

            <div className={classnames("button", "icon", { dark: useDarkMode })} onClick={resetColorAndPrice}>
                <SVG className={classnames("undoIcon", { dark: useDarkMode })} src={UndoIcon} />
            </div>
        </div>
    ) : null;

    // No pixel selected message
    var errorMessageText = errorMessage ? <p className="message error">{errorMessage}</p> : null;

    return (
        <div className="sectionContent">
            <p className="title">Minting Pixel</p>
            <div className="space"></div>

            <Pixel pad={false} />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Set the pixel initial color.</p>
            <ColorPicker />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Set the pixel initial price.</p>
            <PricePicker pixelOwned={false} />
            <div className="space"></div>

            {buttons}
            {errorMessageText}
            <div className="space"></div>
        </div>
    );
}
