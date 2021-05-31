import React, { useContext, useState, useEffect } from "react";
import Identicon from "identicon.js";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Icons
import LogoIcon from "resources/icon/Icon.svg";
import DarkIcon from "resources/icons/dark.svg";
import LightIcon from "resources/icons/light.svg";

export default function Navbar() {
    // Contexts
    const { getCookie } = useContext(Utils);
    const { account, useDarkMode, setDarkMode } = useContext(Data);

    // #################################################
    //   RENDER
    // #################################################

    const userIconSrc = account ? `data:image/png;base64,${new Identicon(account, 56).toString()}` : "";

    return (
        <div className={classnames("navbar", { dark: useDarkMode })}>
            <img src={LogoIcon} alt="" className="logo" />

            <p className="name">CryptoPlace</p>

            <div className={classnames("toggle", { dark: useDarkMode })} onClick={() => setDarkMode(!useDarkMode)}>
                <div className={classnames("handle", { dark: useDarkMode })}>
                    <SVG className={classnames("darkModeIcon", { dark: useDarkMode })} src={useDarkMode ? DarkIcon : LightIcon} />
                </div>
            </div>

            <p className="account">{account ? account : ""}</p>

            <div className="userIconContainer">
                <img src={userIconSrc} alt="" className="userIcon" />
            </div>
        </div>
    );
}
