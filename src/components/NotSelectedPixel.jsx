import React from "react";

// Components
import ColorPicker from "components/ColorPicker";

export default function NotSelectedPixel() {
    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="sectionContent">
            <p className="title">Start by selecting a Pixel</p>
            <div className="space"></div>

            <ColorPicker />
            <div className="space"></div>
        </div>
    );
}
