import React, { useContext } from "react";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Components
import Pixel from "components/Pixel";

export default function OwnedPixel() {
    // Contexts
    const { copy } = useContext(Utils);
    const { pixels /*, useDarkMode*/, selectedPixel } = useContext(Data);

    // Pixel
    const pixelInfo = pixels.current[selectedPixel];

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="sectionContent">
            <p className="title">Your Pixel</p>
            <div className="space"></div>

            <Pixel pad={true} />
            <div className="space"></div>

            <p className="account" data-tip="click to copy" onClick={() => copy(pixelInfo.owner)}>
                {pixelInfo.owner}
            </p>
        </div>
    );
}
