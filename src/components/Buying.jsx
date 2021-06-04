import React, { useContext, useState, useRef, useEffect } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import Web3 from "web3";

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

export default function Buying() {
    // Contexts
    const { pixels, useDarkMode, selectedPixel, pixelLimit, color, setColor, ethPrice, setEthPrice, colorPickerIsValid, ethPriceIsValid } = useContext(Data);
    const { buyPixel } = useContext(API);

    // Pixel
    const pixelInfo = pixels.current[selectedPixel];

    // #################################################
    //   RESET
    // #################################################

    // Reset pixel to blockchain color
    const resetColorAndPrice = () => {
        // Set Color and Price
        setColor(pixelInfo.color);
        setEthPrice(Web3.utils.fromWei(pixelInfo.weiPrice.toString(), "Ether").toString());
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
    //   BUY PIXEL
    // #################################################

    // Minting
    const [loading, setLoading] = useState(false);

    // Mint the pixel
    const buy = async () => {
        // Return if not a valid input (color or price)
        if (!colorPickerIsValid || !ethPriceIsValid) return;

        // Only if it is a valid pixel
        if (typeof selectedPixel === "number" && selectedPixel >= 0 && selectedPixel < pixelLimit.current) {
            setLoading(true);

            // Mint pixel
            const boughtPixel = await buyPixel(selectedPixel, color, ethPrice);

            // Inform about the color change
            if (boughtPixel) window.PubSub.emit("changePixelColorAndPrice", { pixelCoords: selectedPixel, newColor: color, newEthPrice: ethPrice });
            // Show Error
            else {
                setErrorMessage("Pixel purchase unsuccessful");
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
            <div className={classnames("button", { dark: useDarkMode }, { invalid: !colorPickerIsValid || !ethPriceIsValid })} onClick={buy}>
                {loading ? <SVG className={classnames("loadingIcon", { dark: useDarkMode })} src={LoadingIcon} /> : "BUY"}
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
            <p className="title">Buying Pixel</p>
            <div className="space"></div>

            <Pixel pad={false} />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Set the pixel new color.</p>
            <ColorPicker />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Set the pixel new selling price.</p>
            <PricePicker pixelOwned={false} />
            <div className="space"></div>

            {buttons}
            {errorMessageText}
            <div className="space"></div>
        </div>
    );
}
