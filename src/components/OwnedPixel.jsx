import React, { useContext, useState, useRef, useEffect } from "react";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import Web3 from "web3";

// Contexts
import { Utils } from "contexts/Utils";
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Components
import Pixel from "components/Pixel";
import ColorPicker from "components/ColorPicker";
import PricePicker from "components/PricePicker";

// Icons
import LoadingIcon from "resources/icons/loading.svg";
import UndoIcon from "resources/icons/undo.svg";

export default function OwnedPixel() {
    // Contexts
    const { copy } = useContext(Utils);
    const { changePixelColorAndPrice } = useContext(API);
    const { pixels, useDarkMode, selectedPixel, pixelLimit, color, setColor, ethPrice, setEthPrice, colorPickerIsValid, ethPriceIsValid } = useContext(Data);

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
    //   CHANGING COLOR AND / OR PRICE
    // #################################################

    // Minting
    const [loading, setLoading] = useState(false);

    // Mint the pixel
    const changeColorAndPriceOfPixel = async () => {
        // Return if not a valid input (color or price)
        if (!colorPickerIsValid || !ethPriceIsValid) return;

        // Only if it is a valid pixel
        if (typeof selectedPixel === "number" && selectedPixel >= 0 && selectedPixel < pixelLimit.current) {
            setLoading(true);

            // Change pixel color and price
            const pixelChanged = await changePixelColorAndPrice(selectedPixel, color, ethPrice);

            // Inform about the color change
            if (pixelChanged) {
                window.PubSub.emit("changePixelColorAndPrice", { pixelCoords: selectedPixel, newColor: color, newEthPrice: ethPrice });
                setLoading(false);
            }

            // Show Error
            else {
                setErrorMessage("Pixel was not changed");
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
            <div className={classnames("button", { dark: useDarkMode }, { invalid: !colorPickerIsValid || !ethPriceIsValid })} onClick={changeColorAndPriceOfPixel}>
                {loading ? <SVG className={classnames("loadingIcon", { dark: useDarkMode })} src={LoadingIcon} /> : "SAVE"}
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
            <p className="title">Your Pixel</p>
            <div className="space"></div>

            <Pixel pad={true} />
            <div className="space"></div>

            <p className="account" data-tip="click to copy" onClick={() => copy(pixelInfo.owner)}>
                {pixelInfo.owner}
            </p>
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Change the pixel color.</p>
            <ColorPicker />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Change the pixel price.</p>
            <PricePicker pixelOwned={true} />
            <div className="space"></div>

            {buttons}
            {errorMessageText}
            <div className="space"></div>
        </div>
    );
}
