import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Components
import ColorPicker from "components/ColorPicker";

// Icons
import UndoIcon from "resources/icons/undo.svg";

export default function CurrentPixel({ account, color, coords, owned }) {
    // Contexts
    const { copy } = useContext(Utils);
    const { coordsToRowCol, useDarkMode } = useContext(Data);

    // Columns and rows
    const rowCol = coordsToRowCol(coords);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={classnames("currentPixel", { dark: useDarkMode })}>
            <ReactTooltip place="bottom" type={useDarkMode ? "dark" : "light"} className="tooltip" />

            <p className="title">Selected Pixel</p>

            <div className="main">
                <div className="color" style={{ backgroundColor: color }}></div>

                <div className="info">
                    <div className="row">
                        <p className="name">ROW</p>
                        <p className="coord first">{rowCol.row}</p>
                    </div>

                    <div className="row">
                        <p className="name">COL</p>
                        <p className="coord">{rowCol.col}</p>
                    </div>
                </div>
            </div>

            <p className="account" data-tip="click to copy" onClick={() => copy(account)}>
                {account}
            </p>

            <ColorPicker></ColorPicker>

            <div className="lower">
                <div className={classnames("button", { dark: useDarkMode })}>SAVE</div>
                <div className={classnames("button", "icon", { dark: useDarkMode })}>
                    <SVG className={classnames("undoIcon", { dark: useDarkMode })} src={UndoIcon} />
                </div>
            </div>
        </div>
    );
}
