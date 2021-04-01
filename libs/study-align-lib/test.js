    // import studyAlignLib from "./dist/study-align-lib-bundle.js";

    const sal = new studyAlignLib("http://localhost:8080", 1);

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
    window.addEventListener("load", init);

    function mouseEvent() {
        const button2 = document.getElementById('2');
        button2.addEventListener('mouseenter', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.addMouseInteraction('click', event, timestamp, {"aha": "ok"}, {"metos": "datos"});

/*
            sal.logMouseInteraction(1, 'click', event, timestamp).then(response => {
                console.log("createMouseInteraction");
                console.log(response)
            }).catch(error => {
                console.log("ERROR");
                console.log(error);
            });

 */
        });


        const button3 = document.getElementById('3');
        button3.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);


            sal.logMouseInteractionBulk(1, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

            /*
            sal.logMouseInteraction(1, 'click', event, timestamp, {"jokey": "joke"}, {"dis":"metadata"}).then(response => {
                console.log("createMouseInteraction");
                console.log(response)
            }).catch(error => {
                console.log("ERROR");
                console.log(error);
            });
*/

        });

        const button4 = document.getElementById('4');
        button4.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            let failure = sal.mouseInteractionList.slice(12,13);
            sal.mouseInteractionList.push(failure);

            /*
                        sal.logMouseInteraction(1, 'click', event, timestamp).then(response => {
                            console.log("createMouseInteraction");
                            console.log(response)
                        }).catch(error => {
                            console.log("ERROR");
                            console.log(error);
                        });

             */
        });
    }
    window.addEventListener("load", mouseEvent);


    function keyboardEvent() {
        const textinput = document.getElementById('textinput');
        textinput.addEventListener('keydown', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.addKeyboardInteraction('keydown', event, timestamp, {"aha": "ok"}, {"metos": "datos"});
/*
            sal.logKeyboardInteraction(1, 'keydown', event, timestamp).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
*/

        });

        const keyboardBulkButton = document.getElementById('keyboardBulkButton');
        keyboardBulkButton.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.logKeyboardInteractionBulk(1, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

        });
    }
    window.addEventListener("load", keyboardEvent);



    function touchEvent() {
        const touchInput = document.getElementById('touchInput');
        touchInput.addEventListener('touchstart', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.addTouchInteraction('touchstart', event, timestamp, {"aha": "ok"}, {"metos": "datos"});
/*
            sal.logTouchInteraction(1, 'touchstart', event, timestamp).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

*/
        });

        const touchBulkButton = document.getElementById('touchBulkButton');
        touchBulkButton.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.logTouchInteractionBulk(1, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

        });
    }
    window.addEventListener("load", touchEvent);


    function genericEvent() {
        const genericGenerator = document.getElementById('genericGenerator');
        genericGenerator.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            let genericEvent = {"hey": "ho"};

            sal.addGenericInteraction('agado', genericEvent, timestamp, {"metos": "datos"});
/*
            sal.logGenericInteraction(1, 'agadomandango', genericEvent, timestamp).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });
*/

        });

        const genericBulkButton = document.getElementById('genericBulkButton');
        genericBulkButton.addEventListener('click', event => {
            const timestamp = sal.getTimestampWithOffset();
            console.log(event);
            console.log(sal);
            console.log(Date.now());
            console.log(event.timeStamp);

            sal.logGenericInteractionBulk(1, 10).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error);
            });

        });
    }
    window.addEventListener("load", genericEvent);


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
