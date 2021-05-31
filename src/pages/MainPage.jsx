import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { Data } from "contexts/Data";
//import { API } from "contexts/API";

// Components
import CurrentPixel from "components/CurrentPixel";
import Board from "components/Board";

export default function MainPage() {
    // Contexts
    const { loadingDone, /*numRows, pixelCount, pixels,*/ account, color } = useContext(Data);
    //const { changePixelColor } = useContext(API);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        const getPixelInfo = async () => {
            //await changePixelColor("14", "#593838");
            //console.log(`Num rows: ${numRows.current}`);
            //console.log(`Total pixels: ${pixelCount.current}`);
            //console.log(pixels.current);
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
                <CurrentPixel account={account} coords="24" color={color}></CurrentPixel>
            </div>

            <div className="boardContainer">
                <Board />
            </div>
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
