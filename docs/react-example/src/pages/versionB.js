import {useContext, useEffect} from "react";
import {LoggerEvents, TransmitterEvents} from "../studyalign/logger";
import {LoggerContext} from "../studyalign/LoggerContext";

function VersionB() {

    const {logger, proceed, transmitter} = useContext(LoggerContext);

    useEffect(() => {
        logger(LoggerEvents.CUSTOM_EVENT_EXAMPLE, {
            pageLoaded: "versionA",
            time: Date.now()
        });
    }, []);

    const clickHandler = (e) => {
        logger(LoggerEvents.MOUSE_CLICK, e.nativeEvent, {
            meta: "data",
            anything: "you'd like to save alongside the browser event"
        });
    }

    const logBulkHandler = (e) => {
        //events starting with BULK_ indicate that the event should be stored in localstorage
        logger(LoggerEvents.BULK_MOUSE_CLICK, e.nativeEvent, {
            meta: "data",
            anything: "you'd like to save alongside the browser event"
        });
    }

    const transmitBulkHandler = (e) => {
        // sends mouse events from localstorage in chunks of 50 events, default is 25
        transmitter(TransmitterEvents.TRANSMIT_MOUSE_BULK, 50);
    }


    const proceedHandler = () => {
        // tells the backend to proceed (i.e. activating the "next" button)
        proceed();
    }

    const transmitAndProceedHandler = () => {
        try {
            transmitter(TransmitterEvents.TRANSMIT_MOUSE_BULK, 50).then((results) => {
                let shouldProceed = true;
                shouldProceed = results.length !== 0
                results.forEach((result) => {
                    shouldProceed = result.status !== "rejected"
                });
                if (shouldProceed) {
                    proceed();
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            Version B of a prototype
            <div>
                <button onClick={clickHandler}>Click me to log click event</button>
            </div>
            <div>
                <button onClick={logBulkHandler}>Click me to log click event into cache</button>
                <button onClick={transmitBulkHandler}>Click me to transmit bulks of events</button>
            </div>
            <div>
                <button onClick={proceedHandler}>Proceed</button>
            </div>
            <div>
                <button onClick={transmitAndProceedHandler}>Upload event in bulks, then proceed</button>
            </div>
        </div>
    );
}

export default VersionB;
