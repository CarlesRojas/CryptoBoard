import React, { useContext } from "react";

// Contexts
import { Data } from "contexts/Data";

export default function Pixel({ account, color, coords }) {
    // Contexts
    const { coordsToRowCol, rowColToCoords } = useContext(Data);

    // Columns and rows
    const rowCol = coordsToRowCol(coords);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="pixel">
            <div className="main">
                <div className="color" style={{ backgroundColor: color }}></div>
                <div className="info">
                    <div className="coords">
                        <span className="title">Row</span>
                        <span className="coord">{rowCol.row}</span>
                        <span className="title">Col</span>
                        <span className="coord">{rowCol.col}</span>
                    </div>
                    <p className="colorCode">{color}</p>
                </div>
                <div className="buttons">
                    <div className="button">SAVE</div>
                    <div className="button">DISCARD</div>
                </div>
            </div>
            <p className="account">{account}</p>
        </div>
    );
}
