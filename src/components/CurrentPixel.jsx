import React, { useContext } from "react";

// Contexts
import { Data } from "contexts/Data";

// Components
import Pixel from "components/Pixel";

export default function CurrentPixel() {
    // Contexts
    const { account } = useContext(Data);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="currentPixel">
            <Pixel color="#345f32" account={account} coords="15"></Pixel>
        </div>
    );
}
