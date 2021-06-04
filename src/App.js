import React, { useContext, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// Contexts
import { Utils } from "contexts/Utils";
import { Data } from "contexts/Data";

// Pages
import LoadingPage from "pages/LoadingPage";
import MainPage from "pages/MainPage";
import ErrorPage from "pages/ErrorPage";

// Components
import Navbar from "components/Navbar";

export default function App() {
    // Contexts
    const { getCookie } = useContext(Utils);
    const { setDarkMode } = useContext(Data);

    // Refresh page to reflect the account change
    const refresh = () => {
        window.location.reload();
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    // On component mount
    useEffect(() => {
        // Dark mode
        const useDarkModeCookie = getCookie("cryptoplace_dark_mode");
        setDarkMode(useDarkModeCookie && useDarkModeCookie !== "0");

        // Subscribe to events
        window.ethereum.on("accountsChanged", refresh);
        window.ethereum.on("chainChanged", refresh);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app">
            <Navbar />

            <Router>
                <Switch>
                    {/* ################################# */}
                    {/*   ERROR PAGE                      */}
                    {/* ################################# */}
                    <Route path="/error" component={ErrorPage} exact></Route>

                    {/* ################################# */}
                    {/*   MAIN PAGE                       */}
                    {/* ################################# */}
                    <Route path="/main" component={MainPage} exact></Route>

                    {/* ################################# */}
                    {/*   LANDING PAGE                    */}
                    {/* ################################# */}
                    <Route path="/" component={LoadingPage} exact></Route>
                </Switch>
            </Router>
        </div>
    );
}
