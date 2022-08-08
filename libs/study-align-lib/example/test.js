
    /* Integrate the Library in three steps:
        1. Initialize studyAlignLib (STEP1)
        2. Implement data logging (STEP2)
        3. Finish procedure step (STEP3)
     */

    //STEP1: Initialize new studyAlignLib object and
    //The study frontend will pass three GET parameters to your prototype:
    // 1. condition_id
    // 2. logger_key
    // 3. participant_token (will be used in STEP3, see below)
    const url = new URL(window.location.href);

    const conditionId = url.searchParams.get("condition_id") || 1; // value from get parameter or 1 (default)
    const loggerKey = url.searchParams.get("logger_key"); // needed for logging

    // You can also call: `studyAlignLib.getParamsFromURL()` to retrieve the url parameters from URL

    const sal = new studyAlignLib("http://localhost:8000", 1); // params: backend_url and studyId
    sal.setLoggerKey(loggerKey);

    // IGNORE:
    // Example code to participate in the study and store access tokens in the localstorage of the browser
    // There is no need to implement this in your prototypes, since authentication will be managed by the study-frontend
    function init() {
        console.log("init()");
        sal.participate()
            .then(response => {
                console.log("RESPONSE");
                console.log(response);

                sal.storeTokens(response.body);

                console.log("READ TOKENS");
                console.log(sal.readTokens());
                console.log("READ access_token");
                let access_token = sal.readTokens("access_token");
                console.log(access_token)

                sal.me().then(response => {
                    console.log("me without declaring token explicitly");
                    console.log(response)

                    sal.getProcedure(response.body.procedure_id).then(response2 => {
                       console.log(response2)
                    });

                });

               /*sal.me(access_token).then(response => {
                    console.log("me with declaring token explicitly");
                    console.log(response)
                });

                console.log("delete tokens");
                sal.deleteTokens();
                console.log(sal.readTokens());
                */

            })
            .catch(error => {
                console.log("ERROR");
                console.log(error);
            });
    }
    // Execute init method when document is loaded
    window.addEventListener("load", init);


    //STEP2: LOG DATA

    function mouseEvent() {
        // Save mouseenter events on button2 to local storage (can be transmitted in chunks later)
        const button2 = document.getElementById('button2');
        button2.addEventListener('mouseenter', event => {
            const timestamp = sal.getTimestampWithOffset();
            sal.addMouseInteraction('mouseenter', event, timestamp, event.relatedTarget, {"custom_meta": "data goes here"});
            console.log("Added mouseenter event to local storage")
        });

        // Save click events on button3 to local storage (can be transmitted in chunks later)
        const button3 = document.getElementById('button3');
        button3.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            sal.addMouseInteraction('click', event, timestamp, event.relatedTarget, {"custom_meta": "data goes here"});
            console.log("Added click event to local storage")
        });

        // Log the click events on button4 directly to the backend
        const button4 = document.getElementById('button4');
        button4.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            //relatedTarget and metaData are optional params:
            sal.logMouseInteraction(conditionId, 'click', event, timestamp).then(response => {
                console.log("createMouseInteraction");
                console.log(response)
            }).catch(error => {
                console.log("ERROR");
                console.log(error);
            });
        });

        // On click on button5 transmit mouse interaction bulks
        const button5 = document.getElementById('button5');
        button5.addEventListener('click', event => {
            // Log locally stored mouse interactions in bulks / chunks.
            // Chunks have a length of 10 and are going to be related to condition 1.
            sal.logMouseInteractionBulk(conditionId, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
        });

        /* CAN BE IGNORED
        const button4 = document.getElementById('button4');
        button4.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            let failure = sal.mouseInteractionList.slice(12,13);
            sal.mouseInteractionList.push(failure);
        });
         */
    }
    //Add mouse events after document is loaded
    window.addEventListener("load", mouseEvent);


    function keyboardEvent() {
        const textinput = document.getElementById('textinput');
        textinput.addEventListener('keydown', event => {

            // Log keyboard events to local storage
            const timestamp = sal.getTimestampWithOffset();
            const metaData = {"custom_meta_data": "for example", "text": textinput.value};
            sal.addKeyboardInteraction('keydown', event, timestamp, metaData);

            /*
            //Alternatively: Log keyboard events directly!
            sal.logKeyboardInteraction(conditionId, 'keydown', event, timestamp, metaData).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
            */

        });

        // Log chunks of keyboard events to the backend. Bulk / chunk size is 10, condition id is 1
        const keyboardBulkButton = document.getElementById('keyboardBulkButton');
        keyboardBulkButton.addEventListener('click', event => {
            sal.logKeyboardInteractionBulk(conditionId, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
        });
    }
    //Add keyboard events after document is loaded
    window.addEventListener("load", keyboardEvent);


    function touchEvent() {
        const touchInput = document.getElementById('touchInput');
        touchInput.addEventListener('touchstart', event => {

            // Log touch events to local storage
            const timestamp = sal.getTimestampWithOffset();
            sal.addTouchInteraction('touchstart', event, timestamp, {"meta_data": "is optional and can be any JSON object"});

            /*
            //Alternatively: Log touch events directly! metaData is optional
            sal.logTouchInteraction(conditionId, 'touchstart', event, timestamp).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
            */
        });

        // Log chunks of touch events to the backend. Bulk / chunk size is 10, condition id is 1
        const touchBulkButton = document.getElementById('touchBulkButton');
        touchBulkButton.addEventListener('click', event => {
            sal.logTouchInteractionBulk(conditionId, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

        });
    }
    //Add touch events after document is loaded
    window.addEventListener("load", touchEvent);


    function genericEvent() {
        const genericGenerator = document.getElementById('genericGenerator');
        genericGenerator.addEventListener('click', event => {

            // Log generic events (custom events) to local storage
            const timestamp = sal.getTimestampWithOffset();
            let genericEvent = {"hey": "this JSON object can hold any data"};
            sal.addGenericInteraction('YOUR_EVENT_TYPE', genericEvent, timestamp, {"custom_name": "meta_data"});

            /*
            //Alternatively: Log generic events directly! metaData is optional
            sal.logGenericInteraction(conditionId, 'CUSTOM_EVENT', genericEvent, timestamp).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
            */
        });

        // Log chunks of generic events to the backend. Bulk / chunk size is 10, condition id is 1
        const genericBulkButton = document.getElementById('genericBulkButton');
        genericBulkButton.addEventListener('click', event => {
            sal.logGenericInteractionBulk(conditionId, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
        });
    }
    //Add generic events after document is loaded
    window.addEventListener("load", genericEvent);



    // STEP3: Finish procedure step

    // Needs to binded, e.g. on a "Save text" button or similar
    const proceed = async () => {
        const url = new URL(window.location.href);
        const participantToken = url.searchParams.get("participant_token");
        try {
            await sal.updateNavigator(participantToken, "condition", "done");
        } catch (e) {
            console.warn("StudyAlign Navigator could not be updated");
        }
    };



    //IGNORE:
    // SSE to allow bidirectional between backend and frontend
    // There is no need to implement this in your prototypes, since authentication will be managed by the study-frontend
    function sse() {
        const sseStart = document.getElementById('sseStart');
        sseStart.addEventListener('click', event => {
            console.log("SSE");

            sal.startNavigator().then(sse => {
                console.log(sse);
                sse.addEventListener("update", function(event) {
                    // Logic to handle status updates
                    console.log(event)
                });
                sse.addEventListener("end", function(event) {
                    console.log('Handling end....')
                    sal.closeNavigator();
                });
            }).catch(error => {
                console.log(error);
            });
        });
    }
    window.addEventListener("load", sse);

    // Refresh access token
    // There is no need to implement this in your prototypes, since authentication will be managed by the study-frontend
    function refreshToken() {
        const refreshTokenButton = document.getElementById('refresh');
        refreshTokenButton.addEventListener('click', event => {
            sal.refreshToken().then(response => {
                sal.updateAccessToken(response.body);
            }).catch(error => {
                console.log(error);
            });
        });
    }
    window.addEventListener("load", refreshToken);
