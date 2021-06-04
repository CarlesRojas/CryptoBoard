import React, { useContext, useState, useEffect } from "react";
import classnames from "classnames";

// Contexts
import { Data } from "contexts/Data";

// Components
import ListedPixel from "components/ListedPixel";

export default function MyPixels() {
    // Contexts
    const { mintedPixels, useDarkMode, pixels, account } = useContext(Data);

    const [ownerPixels, setOwnerPixels] = useState([]);

    // Get all the pixels from the owner
    const getOwnerPixels = () => {
        var newOwnerPixels = [];
        for (const mintedPixel of mintedPixels.current) if (pixels.current[mintedPixel].owner === account) newOwnerPixels.push(mintedPixel);
        setOwnerPixels(newOwnerPixels);
    };

    // When a pixel has been obtained, add it to the list
    const onPixelHasBeenObtained = ({ pixelCoords }) => {
        setOwnerPixels((oldState) => [...oldState, pixelCoords]);
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        getOwnerPixels();

        // Subscribe to events
        window.PubSub.sub("pixelHasBeenObtained", onPixelHasBeenObtained);

        return () => {
            // Unsubscribe from events
            window.PubSub.unsub("pixelHasBeenObtained", onPixelHasBeenObtained);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    // Message if you still ahve no pixels
    const noPixelsMessage = ownerPixels.length ? null : (
        <React.Fragment>
            <p className={classnames("message", { dark: useDarkMode })}>You do not own any pixels just yet.</p>
            <p className={classnames("message", { dark: useDarkMode })}>Yo can buy one by clicking on it.</p>
            <div className="space"></div>
        </React.Fragment>
    );

    return (
        <div className="sectionContent grow">
            <p className="title">Your Pixels</p>
            <div className="space"></div>

            <div className="myPixels">
                {ownerPixels.map((mintedPixel, i) => (
                    <ListedPixel mintedPixel={mintedPixel} key={i} />
                ))}
            </div>

            {noPixelsMessage}
        </div>
    );
}
