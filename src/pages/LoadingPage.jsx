import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { API } from "contexts/API";
import { Data } from "contexts/Data";

// Icons
import LoadingGif from "resources/icon/LoadingAnimation.gif";

export default function LoadingPage() {
    // Contexts
    const { load, getNumRows, getPixelCount, getPixelLimit, getMintedPixels, getPixels } = useContext(API);
    const { errorType, loadingDone } = useContext(Data);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        const initialLoad = async () => {
            // Load Web3
            const result = await load();

            // Set error
            errorType.current = result === "success" ? "" : result;

            // Landing Complete
            loadingDone.current = true;

            // Change page
            if (result === "success") {
                // Load the pixels
                await getNumRows();
                await getPixelCount();
                await getPixelLimit();
                await getMintedPixels();
                await getPixels();

                setRedirectTo("/main");
            } else setRedirectTo("/error");
        };
        initialLoad();

        // Subscribe to events

        // Unsubscribe from events
        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // #################################################
    //   REDIRECT LOGIC
    // #################################################

    // Redirect state
    const [redirectTo, setRedirectTo] = useState(null);

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="loadingPage">
            <img src={LoadingGif} alt="" className="loadingGif" />
        </div>
    );
}
