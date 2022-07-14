import {
    DragInteraction,
    GenericInteraction,
    KeyboardInteraction,
    MouseInteraction,
    TouchInteraction
} from "./interactions";

class StudyAlignLib {

    apiVersion: string;
    url: string;
    studyId: number;
    apiUrl: string;
    sse: EventSource;

    // Interaction Lists (Web Events only), needed for bulk saving
    mouseInteractionList: MouseInteraction[] = [];
    dragInteractionList: DragInteraction[] = [];
    keyboardInteractionList: KeyboardInteraction[] = [];
    touchInteractionList: TouchInteraction[] = [];
    genericInteractionList: GenericInteraction[] = [];

    constructor(url = "http://localhost:8080", studyId: number) {
        this.apiVersion = "v1";
        this.url = url;
        this.studyId = studyId;
        this.apiUrl = this.url + "/api/" + this.apiVersion;
    }

    static getParamsFromURL = () => {
        const url = new URL(window.location.href);
        const studyId = url.searchParams.get("study_id");
        const conditionId = url.searchParams.get("condition_id") || 1; // value from get parameter or 1 (default)
        const loggerKey = url.searchParams.get("logger_key"); // needed for logging

        return {
            studyId: studyId,
            conditionId: conditionId,
            loggerKey: loggerKey
        }
    }

    getTimestamp() {
        return Date.now;
    }

    getTimestampWithOffset() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + (-1 * date.getTimezoneOffset()))
        return date.getTime();
    }

    setHeaders(options: Options, refresh: boolean = false) {
        const access_token = !refresh ? this.readTokens("access_token") : this.readTokens("refresh_token");
        options.headers["Authorization"] = "Bearer " + access_token;
        options.headers["Content-type"] = "application/json";
    }

    setLoggerHeaders(options: Options) {
        const loggerKey = this.readLoggerKey();
        if (loggerKey) {
            options.headers["Studyalign-Logger-Key"] = loggerKey;
        }
        options.headers["Content-type"] = "application/json";
    }

    request(options: Options) {
        const encodeParams = (data) => {
            return Object.keys(data).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
        }
        return new Promise( (resolve, reject) => {
            let url = this.apiUrl + "/" + options.path;
            let xhr = new XMLHttpRequest();
            xhr.open(options.method, url);
            if (options.onload) {
                xhr.onload = options.onload;
            }
            else {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({
                                status: xhr.status,
                                body: xhr.response ? JSON.parse(xhr.response) : ""
                            });
                    } else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText,
                            requestBody: options.body
                        });
                    }
                };
            }
            if (options.onprogress) {
                xhr.onprogress = options.onprogress;
            }
            if (options.onerror) {
                xhr.onerror = options.onerror;
            } else {
                xhr.onerror = () => {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        requestBody: options.body
                    });
                };
            }

            if (options.headers) {
                Object.keys(options.headers).forEach((key) => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }

            if (options.method === "GET") {
                let params = options.params;
                let encodedParams = "";
                if (params && typeof params === 'object') {
                    encodedParams = encodeParams(params)
                }
                xhr.send(encodedParams);
            }

            if (options.method === "POST" || options.method === "PATCH") {
                xhr.send(options.formData ? encodeParams(options.body) : JSON.stringify(options.body));
            }
        });
    }

    basicCreate(path: string, data: object) {
        let options: Options = {
            method: "POST",
            path: path,
            headers: {}
        }
        this.setHeaders(options);
        options.body = data;
        return this.request(options);
    }

    basicRead(path: string) {
        const options: Options = {
            method: "GET",
            path: path,
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    basicUpdate(path: string, data: object) {
        let options: Options = {
            method: "PATCH",
            path: path,
            headers: {}
        }
        this.setHeaders(options);
        options.body = data;
        return this.request(options);
    }

    // Admin related functions
    userLogin(username: string, password: string) {
        const options: Options = {
            method: "POST",
            path: "users/login",
            headers: {},
            body: {username: username, password: password},
            formData: true
        };
        options.headers["Content-type"] = "application/x-www-form-urlencoded";
        return this.request(options);
    }

    userMe(): Promise<any> {
        return this.basicRead("users/me");
    }

    userRefreshToken() {
        const options: Options = {
            method: "GET",
            path: "users/refresh",
            headers: {}
        }
        this.setHeaders(options, true);
        return this.request(options);
    }

    getUsers() {
        return this.basicRead("users");
    }

    getUser(userId: number) {
        return this.basicRead("users/" + userId);
    }

    createUser(user: object) {
        return this.basicCreate("users", user)
    }

    updateUser(userId: number, user: object) {
        return this.basicUpdate("users/" + userId, user);
    }

    // ---- MAINLY FOR USE IN ADMIN FRONTEND ---- //

    // Studies

    getStudies() {
        return this.basicRead("studies");
    }

    createStudy(study: object) {
        return this.basicCreate("studies", study);
    }

    updateStudy(studyId: number, study: object) {
        return this.basicUpdate("studies/" + studyId, study);
    }

    generateProcedureWithSteps(studyId: number, procedureScheme: object) {
        this.basicCreate("studies/" + studyId + "/procedures", procedureScheme);
    }

    getParticipants(studyId: number) {
        return this.basicRead("studies/" + studyId + "/participants");
    }

    generateParticipants(studyId: number, amount: number) {
        const options: Options = {
            method: "POST",
            path: "studies/" + studyId + "/participants",
            headers: {},
            body: {amount: amount},
            formData: true,
        }
        this.setHeaders(options);
        return this.request(options);
    }

    populateSurveyParticipants(studyId: number) {
        return this.basicRead("studies/" + studyId + "/survey-participants");
    }

    // Conditions

    getConditionIds(studyId: number) {
        const options: Options = {
            method: "GET",
            path: "conditions/ids",
            headers: {},
            body: {study_id: studyId},
            formData: true,
        }
        this.setHeaders(options);
        return this.request(options);
    }

    getCondition(conditionId: number) {
        return this.basicRead("conditions/" + conditionId);
    }

    createCondition(condition: object) {
        return this.basicCreate("conditions", condition);
    }

    updateCondition(conditionId: number, condition: object) {
        return this.basicUpdate("conditions/" + conditionId, condition);
    }

    getConditions(studyId: number) {
        return this.basicRead("studies/" + studyId + "/conditions");
    }

    getTasks(studyId: number) {
        return this.basicRead("studies/" + studyId + "/tasks");
    }

    getTexts(studyId: number) {
        return this.basicRead("studies/" + studyId + "/texts");
    }

    getQuestionnaires(studyId: number) {
        return this.basicRead("studies/" + studyId + "/questionnaires");
    }

    getPauses(studyId: number) {
        return this.basicRead("studies/" + studyId + "/pauses");
    }


    // Procedures

    getProcedures(studyId: number) {
        const options: Options = {
            method: "GET",
            path: "procedures",
            headers: {},
            body: {study_id: studyId},
            formData: true,
        }
        this.setHeaders(options);
        return this.request(options);
    }

    // Participants

    getParticipantsByProcedure(procedureId: number) {
        const options: Options = {
            method: "GET",
            path: "participants",
            headers: {},
            body: {procedure_id: procedureId},
            formData: true,
        }
        this.setHeaders(options);
        return this.request(options);
    }

    getParticipantById(participantId: number) {
        return this.basicRead("participants/" + participantId);
    }

    endParticipantPause(participantToken: string) {
        return this.basicRead("participants/" + participantToken + "/end-pause");
    }

    //Tasks

    createTask(task: object) {
        return this.basicCreate("tasks", task);
    }

    getTask(taskId: number) {
        return this.basicRead("tasks/" + taskId);
    }

    updateTask(taskId: number, task: object) {
        return this.basicUpdate("tasks/" + taskId, task);
    }

    //Texts

    createText(text: object) {
        return this.basicCreate("texts", text);
    }

    getText(textId: number) {
        return this.basicRead("texts/" + textId);
    }

    updateText(textId: number, text: object) {
        return this.basicUpdate("texts/" + textId, text);
    }

    //Questionnaires

    createQuestionnaire(questionnaire: object) {
        return this.basicCreate("questionnaires", questionnaire);
    }

    getQuestionnaire(questionnaireId: number) {
        return this.basicRead("questionnaires/" + questionnaireId);
    }

    updateQuestionnaire(questionnaireId: number, questionnaire: object) {
        return this.basicUpdate("questionnaires/" + questionnaireId, questionnaire);
    }

    //Pauses

    createPause(pause: object) {
        return this.basicCreate("pauses", pause);
    }

    getPause(pauseId: number) {
        return this.basicRead("pauses/" + pauseId);
    }

    updatePause(pauseId: number, pause: object) {
        return this.basicUpdate("pauses/" + pauseId, pause);
    }

    // ---- MAINLY FOR USE IN STUDY FRONTEND ---- //

    //TODO: read condition config

    //Study Frontend related functions

    getStudy(studyId?: number) {
        const options: Options = {
            method: "GET",
            path: "studies/" + (studyId || this.studyId),
        }
        return this.request(options);
    }

    getStudySetupInfo(studyId?: number) {
        return this.basicRead("studies/" + studyId + "/setup-info")
    }

    // Participation related methods

    getParticipant(participantToken: string) {
        const options: Options = {
            method: "GET",
            path: "participants/token/" + participantToken,
        }
        return this.request(options);
    }

    participate(participantToken?: string) {
        let options: Options = {
            method: "GET",
            path: "studies/" + this.studyId + "/participate"
        }
        if (participantToken) {
            options = {
                method: "GET",
                path: "studies/" + this.studyId + "/participate/" + participantToken
            }
        }
        return this.request(options);
    }

    storeTokens(responseJson) {
        localStorage.setItem("tokens", JSON.stringify(responseJson));
    }

    updateAccessToken(responseJson) {
        const tokens = this.readTokens();
        tokens["access_token"] = responseJson["access_token"];
        this.storeTokens(tokens);
    }

    readTokens(key= null) {
        let tokens = localStorage.getItem("tokens");
        if (tokens) {
            tokens = JSON.parse(tokens);
            if (key) {
                return tokens[key];
            }
            return tokens;
        }
        return null;
    }

    deleteTokens() {
        localStorage.removeItem("tokens");
    }

    refreshToken() {
        const options: Options = {
            method: "GET",
            path: "participants/refresh",
            headers: {}
        }
        this.setHeaders(options, true);
        return this.request(options);
    }

    storeLoggerKey(key: string) {
        localStorage.setItem("loggerKey", key);
    }

    readLoggerKey(): string {
        return localStorage.getItem("loggerKey");
    }

    deleteLoggerKey() {
        localStorage.removeItem("loggerKey");
    }

    me(): Promise<any> {
        const options: Options = {
            method: "GET",
            path: "participants/me",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    getProcedure(procedureId: number): Promise<any> {
        const options: Options = {
            method: "GET",
            path: "procedures/" + procedureId,
            headers: {}
        }
        this.setHeaders(options);
        console.log(options);
        return this.request(options);
    }

    // Helper method to create bulks from interaction lists
    private buildBulkList(interactionList: InteractionTypes, bulkSize: number = 10) {
        const bulks = [];
        while (this[interactionList].length > bulkSize) {
            bulks.push(this[interactionList].splice(0, bulkSize));
        }
        if (this[interactionList].length > 0) {
            bulks.push(this[interactionList].splice(0, this[interactionList].length));
        }
        return bulks;
    }

    // TODO: type callback correctly, starting point could be (conditionId: number, interactions: object[]) => Promise<any>
    logInteractionBulk(path: string, conditionId: number, interactionList: InteractionTypes, bulkSize: number,
                        logInteractionBulkRequest) {
        const interactionBulks = this.buildBulkList(interactionList, bulkSize);
        const interactionBulkRequests = [];
        for (let i = 0; i < interactionBulks.length; i++) {
            interactionBulkRequests.push(logInteractionBulkRequest(path, conditionId, interactionBulks[i]));
        }
        return Promise.allSettled(interactionBulkRequests);
    }

    private logInteractionBulkRequest(path: string, conditionId: number, interactions: object[]) {
        const options: Options = {
            method: "POST",
            path: path,
            headers: {}
        }
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interactions: interactions
        };
        return this.request(options);
    }

    private logInteractionRequest(path: string, conditionId: number, interaction: object) {
        const options: Options = {
            method: "POST",
            path: path,
            headers: {}
        }
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interaction: interaction
        };
        return this.request(options);
    }

    // Mouse Interaction

    logMouseInteraction(conditionId: number, eventType: string, mouseEvent: MouseEvent, timestamp: number,
                           relatedTarget: {} = {}, metaData: {} = {}) {
        const interaction = new MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData);
        const path = "interaction/mouse";
        return this.logInteractionRequest(path, conditionId, interaction);
    }

    addMouseInteraction(eventType: string, mouseEvent: MouseEvent, timestamp: number, relatedTarget: {} = {}, metaData: {} = {}) {
        this.mouseInteractionList.push(new MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData));
    }

    logMouseInteractionBulk(conditionId: number, bulkSize: number = 10): Promise<any> {
        const interactionType = "mouseInteractionList"
        const path = "interaction/mouse/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }

    // Drag Interaction

    logDragInteraction(conditionId: number, eventType: string, dragEvent: DragEvent, timestamp: number,
                        relatedTarget: {} = {}, metaData: {} = {}) {
        const interaction = new DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData);
        const path = "interaction/drag";
        return this.logInteractionRequest(path, conditionId, interaction);
    }

    addDragInteraction(eventType: string, dragEvent: DragEvent, timestamp: number, relatedTarget: {} = {}, metaData: {} = {}) {
        this.dragInteractionList.push(new DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData));
    }

    logDragInteractionBulk(conditionId: number, bulkSize: number = 10): Promise<any> {
        const interactionType = "dragInteractionList"
        const path = "interaction/drag/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }

    // Keyboard Interaction

    logKeyboardInteraction(conditionId: number, eventType: string, keyboardEvent: KeyboardEvent, timestamp: number,
                           metaData: {} = {}) {
        const interaction = new KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData);
        const path = "interaction/keyboard";
        return this.logInteractionRequest(path, conditionId, interaction);
    }

    addKeyboardInteraction(eventType: string, keyboardEvent: KeyboardEvent, timestamp: number, metaData: {} = {}) {
        this.keyboardInteractionList.push(new KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData));
    }

    logKeyboardInteractionBulk(conditionId: number, bulkSize: number = 10): Promise<any> {
        const interactionType = "keyboardInteractionList"
        const path = "interaction/keyboard/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }

    // Touch Interaction

    logTouchInteraction(conditionId: number, eventType: string, touchEvent: TouchEvent, timestamp: number,
                           metaData: {} = {}) {
        const interaction = new TouchInteraction(eventType, timestamp, touchEvent, metaData);
        const path = "interaction/touch";
        return this.logInteractionRequest(path, conditionId, interaction);
    }

    addTouchInteraction(eventType: string, touchEvent: TouchEvent, timestamp: number, metaData: {} = {}) {
        this.touchInteractionList.push(new TouchInteraction(eventType, timestamp, touchEvent, metaData));
    }

    logTouchInteractionBulk(conditionId: number, bulkSize: number = 10): Promise<any> {
        const interactionType = "touchInteractionList"
        const path = "interaction/touch/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }

    // Generic Interaction

    logGenericInteraction(conditionId: number, eventType: string, genericEvent: object, timestamp: number,
                        metaData: {} = {}) {
        const interaction = new GenericInteraction(eventType, timestamp, genericEvent, metaData);
        const path = "interaction/generic";
        return this.logInteractionRequest(path, conditionId, interaction);
    }

    addGenericInteraction(eventType: string, genericEvent: object, timestamp: number, metaData: {} = {}) {
        this.genericInteractionList.push(new GenericInteraction(eventType, timestamp, genericEvent, metaData));
    }

    logGenericInteractionBulk(conditionId: number, bulkSize: number = 10): Promise<any> {
        const interactionType = "genericInteractionList"
        const path = "interaction/generic/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }

    // Procedure related methods

    startProcedure() {
        const options: Options = {
            method: "GET",
            path: "procedures/start",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    nextProcedure() {
        const options: Options = {
            method: "GET",
            path: "procedures/next",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    endProcedure() {
        const options: Options = {
            method: "GET",
            path: "procedures/end",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    currentProcedureStep() {
        const options: Options = {
            method: "GET",
            path: "procedure-steps",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    checkSurveyResult() {
        const options: Options = {
            method: "GET",
            path: "procedures/check-survey-result",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    startNavigator() {
        return new Promise( (resolve, reject) => {
            // get the user token (uuid)
            this.me().then(response => {
                if (response.body) {
                    const participantToken = response.body.token;
                    const url = this.apiUrl + "/" + "procedures/navigator?participant=" + participantToken;
                    this.sse = new EventSource(url, {withCredentials: true});
                    resolve(true);
                }
                reject({
                    text: "Participant not found"
                });
            }).catch(error => {
                console.log(error);
                resolve(error);
            });
        });
    }

    closeNavigator() {
        this.sse.close();
    }

    reconnectNavigator() {
        const options: Options = {
            method: "GET",
            path: "procedures/navigator/reconnect",
            headers: {}
        }
        this.setHeaders(options);
        return this.request(options);
    }

    getNavigator() {
        return this.sse;
    }

    updateNavigator(participantToken: string, source: NavigatorSource, state: NavigatorState, extId: number) {
        const options: Options = {
            method: "POST",
            path: "procedures/navigator",
            headers: {}
        }
        this.setHeaders(options);
        options.body = {
            participant_token: participantToken,
            source: source,
            state: state,
            ext_id: extId
        };
        return this.request(options);
    }

}
export default StudyAlignLib;