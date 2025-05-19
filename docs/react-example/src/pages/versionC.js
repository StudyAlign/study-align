import {useContext, useEffect} from "react";
import {LoggerEvents, TransmitterEvents} from "../studyalign/logger";
import {LoggerContext} from "../studyalign/LoggerContext";

function VersionC() {

    const {logger, proceed, transmitter} = useContext(LoggerContext);

    useEffect(() => {
        logger(LoggerEvents.CUSTOM_EVENT_EXAMPLE, {
            pageLoaded: "versionA",
            time: Date.now()
        });
    }, []);

    const logBulkHandler = (e) => {
        //events starting with BULK_ indicate that the event should be stored in localstorage
        logger(LoggerEvents.BULK_TOUCH_START, e.nativeEvent, {
            meta: "data",
            anything: "you'd like to save alongside the browser event"
        });
    }

    const transmitBulkHandler = (e) => {
        // sends mouse events from localstorage in chunks of 30 events, default is 25
        transmitter(TransmitterEvents.TRANSMIT_TOUCH_BULK, 30);
    }


    const proceedHandler = () => {
        // tells the backend to proceed (i.e. activating the "next" button)
        proceed();
    }

    return (
        <div>
            Version C of a prototype
            <div>
                Touch canvas to store events into localstorage:
                <canvas onTouchStart={logBulkHandler} style={{width: "500px", height: "500px", backgroundColor: "teal"}}></canvas>
                <button onClick={transmitBulkHandler}>Click me to transmit bulks of events</button>
            </div>
            <div>
                <button onClick={proceedHandler}>Proceed</button>
            </div>
        </div>
    );
}

export default VersionC;
