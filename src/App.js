import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// Pages
import LoadingPage from "pages/LoadingPage";
import MainPage from "pages/MainPage";
import ErrorPage from "pages/ErrorPage";

export default function App() {
    return (
        <div className="app">
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
