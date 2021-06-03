import React, { useContext, useRef, useState, useEffect } from "react";
import classNames from "classnames";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

export default function PricePicker() {
    // Contexts
    const { isFloat } = useContext(Utils);
    const { ethPrice, setEthPrice, useDarkMode, ethPriceIsValid, setEthPriceIsValid } = useContext(Data);

    // #################################################
    //   INPUTS
    // #################################################

    // Input Value
    const [ethPriceValue, setEthPriceValue] = useState(ethPrice);

    // Input ref
    const redInputRef = useRef(null);

    // Set valid price
    const setValidPrice = (value) => {
        // Is valid
        setEthPriceIsValid(true);

        // Set price
        setEthPriceValue(value);
        setEthPrice(value);
    };

    // Check if the price is valid
    const checkPrice = (value) => {
        var isValid = true;

        let isFloatNum = isFloat(value);
        const number = parseFloat(value);
        if (!isFloatNum || number < 0) isValid = false;

        return isValid;
    };

    // Update all when the final color is updated
    const ethPriceEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (ethPriceEffectFirstRun.current) return (ethPriceEffectFirstRun.current = false);

        setValidPrice(ethPrice.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethPrice]);

    // Update all when red input is updated and all the rgb are valid
    const ethPriceValueEffectFirstRun = useRef(true);
    useEffect(() => {
        // Skip first time
        if (ethPriceValueEffectFirstRun.current) return (ethPriceValueEffectFirstRun.current = false);

        const valid = checkPrice(ethPriceValue);
        if (valid) setValidPrice(ethPriceValue);
        else setEthPriceIsValid(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ethPriceValue]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="pricePicker">
            <div className="inputContainer">
                <input
                    type="text"
                    className={classNames("input", { invalid: !ethPriceIsValid }, { dark: useDarkMode })}
                    value={ethPriceValue}
                    onChange={(e) => setEthPriceValue(e.target.value.toString())}
                    ref={redInputRef}
                    spellCheck="false"
                />

                <p className="unit">ETH</p>
            </div>

            <p className="message small">Other people will be able to buy this pixel from you at any point for this price.</p>
        </div>
    );
}
