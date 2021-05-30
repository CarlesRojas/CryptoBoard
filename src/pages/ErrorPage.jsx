import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

// Contexts
import { Data } from "contexts/Data";

export default function ErrorPage() {
    // Contexts
    const { errorType, loadingDone } = useContext(Data);

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

    console.log(errorType);
    return <div className="errorPage"></div>;
}
