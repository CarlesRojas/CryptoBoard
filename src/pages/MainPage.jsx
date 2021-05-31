import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { Data } from "contexts/Data";

// Components
import ColorPicker from "components/ColorPicker";
import CurrentPixel from "components/CurrentPixel";

export default function MainPage() {
    // Contexts
    const { loadingDone, numRows, pixelCount, pixels } = useContext(Data);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On componente mount
    useEffect(() => {
        const getPixelInfo = async () => {
            console.log(`Num rows: ${numRows.current}`);
            console.log(`Total pixels: ${pixelCount.current}`);
            console.log(pixels.current);
        };
        getPixelInfo();

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

    // Go to landing if not done already
    if (!redirectTo && !loadingDone.current) setRedirectTo("/");

    // Redirect to new route
    if (redirectTo) return <Redirect to={redirectTo} push={true} />;

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="mainPage">
            <div className="sidebar">
                <CurrentPixel></CurrentPixel>
                <ColorPicker></ColorPicker>
            </div>
            <div className="board"></div>
        </div>
    );
}

/* COORDINATE SYSTEM

    numRows = 5
    pixelCount = 25

    0  5  10  15  20
    1  6  11  16  21
    2  7  12  17  22
    3  8  13  18  23
    4  9  14  19  24

    Coord to Row & Col
        row = coord % numRows
        col = floor(coord / numRows)

    Row & Col to Coord
        coord = col * numRows + row
*/
