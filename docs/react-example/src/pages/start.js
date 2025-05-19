import logo from '../logo.svg';
import {useContext, useEffect} from "react";
import {LoggerContext} from "../studyalign/LoggerContext";
import {LoggerEvents} from "../studyalign/logger";


function Start() {

    const {logger} = useContext(LoggerContext);

    useEffect(() => {
        logger(LoggerEvents.CUSTOM_EVENT_EXAMPLE, {
            pageLoaded: "start",
            time: Date.now()
        });
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default Start;
