import {useEffect, useMemo, useState} from 'react';
import StudyAlignLib from "./lib/study-align-lib";

export default function useLogger(apiUrl) {
    const urlParams = useMemo(() => {
        return StudyAlignLib.getParamsFromURL()
    }, []);

    console.log(urlParams);

    const [sal, setSal] = useState(new StudyAlignLib(apiUrl, urlParams.studyId));
    const [conditionId, setConditionId] = useState(urlParams.conditionId);
    const [loggerKey, setLoggerKey] = useState(urlParams.loggerKey);
    const [participantToken, setParticipantToken] = useState(urlParams.participantToken);
    const [isready, setIsReady] = useState(false);

    useEffect(() => {
        if (sal) {
            if (loggerKey) {
                sal.setLoggerKey(loggerKey);
            }
            if (conditionId && loggerKey) {
                setIsReady(true);
            }
        }
    }, []);

    async function logger(eventName, data, metaData = {}) {
        const timestamp = Date.now();
        try {
            switch (eventName) {
                case LoggerEvents.USER_AGENT:
                    await sal.logGenericInteraction(
                        conditionId,
                        eventName,
                        data,
                        timestamp,
                    );
                    break;
                case LoggerEvents.MOUSE_CLICK:
                case LoggerEvents.MOUSE_DBLCLICK:
                case LoggerEvents.MOUSE_UP:
                case LoggerEvents.MOUSE_DOWN:
                case LoggerEvents.MOUSE_ENTER:
                case LoggerEvents.MOUSE_LEAVE:
                case LoggerEvents.MOUSE_OUT:
                case LoggerEvents.MOUSE_OVER:
                    await sal.logMouseInteraction(
                        conditionId,
                        eventName,
                        data,
                        timestamp,
                        data.relatedTarget,
                        metaData,
                    );
                    break;
                case LoggerEvents.KEY_DOWN:
                case LoggerEvents.KEY_UP:
                case LoggerEvents.KEY_PRESS:
                    await sal.logKeyboardInteraction(
                        conditionId,
                        eventName,
                        data,
                        timestamp,
                        metaData,
                    );
                    break;
                case LoggerEvents.CUSTOM_EVENT_EXAMPLE:
                case LoggerEvents.FINAL_EVENT_EXAMPLE:
                    await sal.logGenericInteraction(
                        conditionId,
                        eventName,
                        data,
                        timestamp,
                        metaData,
                    );
                    break;
            }
        } catch (e) {
            console.warn('LOGGING FAILED', e);
        }
    }

    async function bulkLogger(eventName, data, metaData = {}) {
        const timestamp = Date.now();
        try {
            switch (eventName) {
                case LoggerEvents.BULK_MOUSE_CLICK:
                case LoggerEvents.BULK_MOUSE_DBLCLICK:
                case LoggerEvents.BULK_MOUSE_UP:
                case LoggerEvents.BULK_MOUSE_DOWN:
                case LoggerEvents.BULK_MOUSE_ENTER:
                case LoggerEvents.BULK_MOUSE_LEAVE:
                case LoggerEvents.BULK_MOUSE_OUT:
                case LoggerEvents.BULK_MOUSE_OVER:
                    await sal.addMouseInteraction(
                        bulk_to_event(eventName),
                        data,
                        timestamp,
                        data.relatedTarget,
                        metaData,
                    );
                    break;
                case LoggerEvents.BULK_KEY_DOWN:
                case LoggerEvents.BULK_KEY_UP:
                case LoggerEvents.BULK_KEY_PRESS:
                    await sal.addKeyboardInteraction(
                        bulk_to_event(eventName),
                        data,
                        timestamp,
                        metaData,
                    );
                    console.log(sal.keyboardInteractionList)
                    break;
                case LoggerEvents.BULK_TOUCH_START:
                    await sal.addTouchInteraction(
                        bulk_to_event(eventName),
                        data,
                        timestamp,
                        metaData,
                    );
                    break;
                case LoggerEvents.BULK_CUSTOM_EVENT_EXAMPLE:
                    await sal.addGenericInteraction(
                        bulk_to_event(eventName),
                        data,
                        timestamp,
                        metaData,
                    );
                    break;
            }
        } catch (e) {
            console.warn('LOGGING FAILED', e);
        }
    }

    function bulk_to_event(eventName) {
        return eventName.slice(5); //remove bulk_ from string
    }

    async function transmitter(eventName, bulkSize = 25) {
        try {
            switch (eventName) {
                case TransmitterEvents.TRANSMIT_MOUSE_BULK:
                    return await sal.logMouseInteractionBulk(conditionId, bulkSize);
                    break;
                case TransmitterEvents.TRANSMIT_KEY_BULK:
                    return await sal.logKeyboardInteractionBulk(conditionId, bulkSize);
                    break;
                case TransmitterEvents.TRANSMIT_TOUCH_BULK:
                    return await sal.logTouchInteractionBulk(conditionId, bulkSize);
                    break;
                case TransmitterEvents.TRANSMIT_GENERIC_BULK:
                    return await sal.logGenericInteractionBulk(conditionId, bulkSize);
                    break;
            }
        } catch (e) {
            console.warn('TRANSMISSION OF BULKS FAILED', e);
        }
    }

    function dispatch(eventName, data, metaData = {}) {
        if (conditionId === 0) {
            console.warn(
                'Cannot useLogger since no condition_id has been provided.',
                eventName,
                data,
                metaData,
            );
        } else if (!sal.loggerKey) {
            console.warn(
                'Cannot useLogger since no logger_key has been provided.',
                eventName,
                data,
                metaData,
            );
        } else {
            if (!eventName.includes("bulk_")) {
                logger(eventName, data, metaData);
            } else {
                bulkLogger(eventName, data, metaData);
            }
        }
    }

    async function proceed(){
        try {
            await sal.updateNavigator(
                participantToken,
                'condition',
                'done',
            );
        } catch (e) {
            console.warn('StudyAlign Navigator could not be updated');
        }
    }

    return [isready, sal, dispatch, proceed, transmitter];
}

export const LoggerEvents = Object.freeze({
    // Procedure specific events
    USER_AGENT: 'USER_AGENT',
    // browser interaction events
    MOUSE_CLICK: 'click',
    MOUSE_DBLCLICK: 'dblclick',
    MOUSE_UP: 'mouseup',
    MOUSE_DOWN: 'mousedown',
    MOUSE_ENTER: 'mouseenter',
    MOUSE_LEAVE: 'mouseleave',
    MOUSE_OUT: 'mouseout',
    MOUSE_OVER: 'mouseover',
    KEY_DOWN: 'keydown',
    KEY_UP: 'keyup',
    KEY_PRESS: 'keypress',
    TOUCH_START: 'touchstart',
    // browser interaction events, adding to bulk
    BULK_MOUSE_CLICK: 'bulk_click',
    BULK_MOUSE_DBLCLICK: 'bulk_dblclick',
    BULK_MOUSE_UP: 'bulk_mouseup',
    BULK_MOUSE_DOWN: 'bulk_mousedown',
    BULK_MOUSE_ENTER: 'bulk_mouseenter',
    BULK_MOUSE_LEAVE: 'bulk_mouseleave',
    BULK_MOUSE_OUT: 'bulk_mouseout',
    BULK_MOUSE_OVER: 'bulk_mouseover',
    BULK_KEY_DOWN: 'bulk_keydown',
    BULK_KEY_UP: 'bulk_keyup',
    BULK_KEY_PRESS: 'bulk_keypress',
    BULK_TOUCH_START: 'bulk_touchstart',
    BULK_CUSTOM_EVENT_EXAMPLE: 'BULK_CUSTOM_EVENT_EXAMPLE',
    // Example Events
    CUSTOM_EVENT_EXAMPLE: 'CUSTOM_EVENT_EXAMPLE',
    FINAL_EVENT_EXAMPLE: 'FINAL_EVENT_EXAMPLE'
});

export const TransmitterEvents = Object.freeze({
    TRANSMIT_MOUSE_BULK: 'transmit_mouse_bulk',
    TRANSMIT_KEY_BULK: 'transmit_key_bulk',
    TRANSMIT_TOUCH_BULK: 'transmit_touch_bulk',
    TRANSMIT_GENERIC_BULK: 'transmit_generic_bulk',
})
