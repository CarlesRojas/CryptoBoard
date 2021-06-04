import React, { useContext } from "react";
import classnames from "classnames";
import Web3 from "web3";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Components
import Pixel from "components/Pixel";

export default function NotOwnedPixel() {
    // Contexts
    const { copy } = useContext(Utils);
    const { pixels, useDarkMode, selectedPixel, setBuying } = useContext(Data);

    // Pixel
    const pixelInfo = pixels.current[selectedPixel];

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="sectionContent">
            <p className="title">Not your Pixel</p>
            <div className="space"></div>

            <Pixel pad={true} />
            <div className="space"></div>

            <p className="account" data-tip="click to copy" onClick={() => copy(pixelInfo.owner)}>
                {pixelInfo.owner}
            </p>
            <div className="space"></div>

            <p className={classnames("message", { dark: useDarkMode })}>Buy this pixel for</p>
            <div className="money">
                <p className="value">{Web3.utils.fromWei(pixelInfo.weiPrice.toString(), "Ether").toString()}</p>
                <p className="unit">ETH</p>
            </div>
            <div className="space"></div>

            <div className="buttonsContainer">
                <div className={classnames("button", { dark: useDarkMode })} onClick={() => setBuying(true)}>
                    BUY
                </div>
            </div>
            <div className="space"></div>
        </div>
    );
}
