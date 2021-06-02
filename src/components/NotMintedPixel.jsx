import React, { useContext } from "react";
import classnames from "classnames";

// Contexts
import { Data } from "contexts/Data";

// Components
import Pixel from "components/Pixel";

export default function NotMintedPixel() {
    // Contexts
    const { useDarkMode, setMinting } = useContext(Data);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="sectionContent">
            <p className="title">Unminted Pixel</p>
            <div className="space"></div>

            <Pixel pad={true} />
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>This pixel has not yet been minted.</p>
            <p className={classnames("message", { dark: useDarkMode })}>Get it for only the price of gas.</p>
            <p className={classnames("message", { dark: useDarkMode })}>You will own it and be able to change its color.</p>
            <div className="space"></div>

            <div className="money">
                <p className="value">0</p>
                <p className="unit">ETH</p>
            </div>
            <p className={classnames("message", "small", { dark: useDarkMode })}>+ GAS</p>
            <div className="space"></div>

            <div className="buttonsContainer">
                <div className={classnames("button", { dark: useDarkMode })} onClick={() => setMinting(true)}>
                    MINT
                </div>
            </div>
            <div className="space"></div>
        </div>
    );
}
