import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import classnames from "classnames";
import SVG from "react-inlinesvg";

// Contexts
import { Data } from "contexts/Data";

// Icons
import ErrorIcon from "resources/icon/IconError.svg";

export default function ErrorPage() {
    // Contexts
    const { errorType, useDarkMode, loadingDone } = useContext(Data);

    // Reload the page
    console.log(loadingDone.current);
    const reloadPage = () => {
        console.log("reload");
        window.location.reload();
    };

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

    // Error Title
    if (errorType.current === "no-eth-accounts") var title = "No account detected";
    else if (errorType.current === "contract-not-deployed") title = "Contract not deployed to this network";
    else if (errorType.current === "non-eth-browser") title = "No Ethereum Provider detected in the browser";
    else if (errorType.current === "user-reject") title = "You have rejected the connection with your Ethereum Provider";
    else if (errorType.current === "request-pending") title = "You have not accepted the connection request";
    else title = "An unknown error occurred";

    // Error subtitle
    if (errorType.current === "no-eth-accounts") var subtitle = "Make sure to add your account to your Ethereum Provider (E.g. Metamask).";
    else if (errorType.current === "contract-not-deployed") subtitle = "You are not in a network where this contract is deployed. Try changing it in your Ethereum Provider (E.g. Metamask).";
    else if (errorType.current === "non-eth-browser") subtitle = "Connecting to one is essential to run this page. We recommend installing MetaMask.";
    else if (errorType.current === "user-reject") subtitle = "Reload to show the connection request again.";
    else if (errorType.current === "request-pending") subtitle = "Accept the connection from your Ethereum Provider (E.g. Metamask).";
    else subtitle = "Try again in a few seconds.";

    console.log(errorType);
    return (
        <div className="errorPage">
            <div className={classnames("errorContainer", { dark: useDarkMode })}>
                <SVG className={classnames("errorIcon", { dark: useDarkMode })} src={ErrorIcon} />

                <p className="title">{title}</p>

                <p className={classnames("subtitle", { dark: useDarkMode })}>{subtitle}</p>

                <div className={classnames("button", { dark: useDarkMode })} onClick={reloadPage}>
                    RELOAD
                </div>
            </div>
        </div>
    );
}
