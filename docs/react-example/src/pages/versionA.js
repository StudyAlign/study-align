import {useContext, useEffect} from "react";
import {LoggerContext} from "../studyalign/LoggerContext";
import {LoggerEvents} from "../studyalign/logger";

function VersionA() {

    const {logger, proceed} = useContext(LoggerContext);

    useEffect(() => {
        logger(LoggerEvents.CUSTOM_EVENT_EXAMPLE, {
            pageLoaded: "versionA",
            time: Date.now()
        });
    }, []);

    const changeHandler = (e) => {
        logger(LoggerEvents.KEY_DOWN, e.nativeEvent, {
            meta: "data",
            anything: "you'd like to save alongside the browser event"
        });
    }

    const proceedHandler = () => {
        // tells the backend to proceed (i.e. activating the "next" button)
        proceed();
    }

    return (
        <div>
            Version A of a prototype
            <div>
                <textarea onChange={changeHandler} placeholder={"Type to log events"} rows={18} cols={60}/>
            </div>
            <div>
                <button onClick={proceedHandler}>Proceed</button>
            </div>
        </div>
    );
}

export default VersionA;
