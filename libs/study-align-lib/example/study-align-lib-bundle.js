(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("studyAlignLib", [], factory);
	else if(typeof exports === 'object')
		exports["studyAlignLib"] = factory();
	else
		root["studyAlignLib"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/interactions.ts":
/*!*****************************!*\
  !*** ./src/interactions.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MouseInteraction": () => (/* binding */ MouseInteraction),
/* harmony export */   "DragInteraction": () => (/* binding */ DragInteraction),
/* harmony export */   "TouchInteraction": () => (/* binding */ TouchInteraction),
/* harmony export */   "KeyboardInteraction": () => (/* binding */ KeyboardInteraction),
/* harmony export */   "GenericInteraction": () => (/* binding */ GenericInteraction)
/* harmony export */ });
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/v4.js");

class InteractionBase {
    constructor(eventType, timestamp, metaData) {
        this.uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_0__.default)();
        this.event = eventType;
        this.time = timestamp;
        this.metaData = metaData;
    }
}
class MouseInteraction extends InteractionBase {
    constructor(eventType, timestamp, mouseEvent, relatedTarget = {}, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.screenX = mouseEvent.screenX;
        this.screenY = mouseEvent.screenY;
        this.clientX = mouseEvent.clientX;
        this.clientY = mouseEvent.clientY;
        this.ctrlKey = mouseEvent.ctrlKey;
        this.shiftKey = mouseEvent.shiftKey;
        this.altKey = mouseEvent.altKey;
        this.metaKey = mouseEvent.metaKey;
        this.button = mouseEvent.button;
        this.relatedTarget = relatedTarget;
        this.x = mouseEvent.screenX;
        this.y = mouseEvent.screenY;
    }
}
class DragInteraction extends MouseInteraction {
    constructor(eventType, timestamp, dragEvent, relatedTarget = {}, metaData = {}) {
        super(eventType, timestamp, dragEvent, relatedTarget, metaData);
    }
}
class TouchBase {
    constructor(touch) {
        this.uuid = (0,uuid__WEBPACK_IMPORTED_MODULE_0__.default)();
        this.altitudeAngle = touch.altitudeAngle;
        this.azimuthAngle = touch.azimuthAngle;
        this.clientX = touch.clientX;
        this.clientY = touch.clientY;
        this.force = touch.force;
        this.identifier = touch.identifier;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
        this.radiusX = touch.radiusX;
        this.radiusY = touch.radiusY;
        this.rotationAngle = touch.rotationAngle;
        this.screenX = touch.screenX;
        this.screenY = touch.screenY;
        this.target = touch.target;
        this.touchType = touch.touchType;
    }
}
class TouchInteraction extends InteractionBase {
    constructor(eventType, timestamp, touchEvent, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.changedTouches = [];
        this.targetTouches = [];
        this.touches = [];
        this.altKey = touchEvent.altKey;
        this.ctrlKey = touchEvent.ctrlKey;
        this.metaKey = touchEvent.metaKey;
        this.shiftKey = touchEvent.shiftKey;
        if (touchEvent.changedTouches && touchEvent.changedTouches.length > 0) {
            for (let i = 0; i < touchEvent.changedTouches.length; i++) {
                this.changedTouches.push(new TouchBase(touchEvent.changedTouches[i]));
            }
        }
        if (touchEvent.targetTouches && touchEvent.targetTouches.length > 0) {
            for (let i = 0; i < touchEvent.targetTouches.length; i++) {
                this.targetTouches.push(new TouchBase(touchEvent.targetTouches[i]));
            }
        }
        if (touchEvent.touches && touchEvent.touches.length > 0) {
            for (let i = 0; i < touchEvent.touches.length; i++) {
                this.touches.push(new TouchBase(touchEvent.touches[i]));
            }
        }
    }
}
class KeyboardInteraction extends InteractionBase {
    constructor(eventType, timestamp, keyboardEvent, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.altKey = keyboardEvent.altKey;
        this.code = keyboardEvent.code;
        this.isComposing = keyboardEvent.isComposing;
        this.key = keyboardEvent.key;
        this.location = keyboardEvent.location;
        this.metaKey = keyboardEvent.metaKey;
        this.repeat = keyboardEvent.repeat;
        this.shiftKey = keyboardEvent.shiftKey;
    }
}
class GenericInteraction extends InteractionBase {
    constructor(eventType, timestamp, genericEventData, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.data = genericEventData;
    }
}


/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-browser/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-browser/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-browser/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-browser/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/study-align-lib.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _interactions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interactions */ "./src/interactions.ts");

class StudyAlignLib {
    constructor(url = "http://localhost:8080", studyId) {
        // Interaction Lists (Web Events only), needed for bulk saving
        this.mouseInteractionList = [];
        this.dragInteractionList = [];
        this.keyboardInteractionList = [];
        this.touchInteractionList = [];
        this.genericInteractionList = [];
        this.apiVersion = "v1";
        this.url = url;
        this.studyId = studyId;
        this.apiUrl = this.url + "/api/" + this.apiVersion;
    }
    getTimestamp() {
        return Date.now;
    }
    getTimestampWithOffset() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + (-1 * date.getTimezoneOffset()));
        return date.getTime();
    }
    setHeaders(options, refresh = false) {
        const access_token = !refresh ? this.readTokens("access_token") : this.readTokens("refresh_token");
        options.headers["Authorization"] = "Bearer " + access_token;
        options.headers["Content-type"] = "application/json";
    }
    setLoggerHeaders(options) {
        const loggerKey = this.readLoggerKey();
        if (loggerKey) {
            options.headers["Studyalign-Logger-Key"] = loggerKey;
        }
        options.headers["Content-type"] = "application/json";
    }
    request(options) {
        const encodeParams = (data) => {
            return Object.keys(data).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
        };
        return new Promise((resolve, reject) => {
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
                    }
                    else {
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
            }
            else {
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
                    encodedParams = encodeParams(params);
                }
                xhr.send(encodedParams);
            }
            if (options.method === "POST" || options.method === "PATCH") {
                xhr.send(options.formData ? encodeParams(options.body) : JSON.stringify(options.body));
            }
        });
    }
    basicCreate(path, data) {
        let options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        options.body = data;
        return this.request(options);
    }
    basicRead(path) {
        const options = {
            method: "GET",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    basicUpdate(path, data) {
        let options = {
            method: "PATCH",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        options.body = data;
        return this.request(options);
    }
    // Admin related functions
    userLogin(username, password) {
        const options = {
            method: "POST",
            path: "users/login",
            headers: {},
            body: { username: username, password: password },
            formData: true
        };
        options.headers["Content-type"] = "application/x-www-form-urlencoded";
        return this.request(options);
    }
    userMe() {
        return this.basicRead("users/me");
    }
    userRefreshToken() {
        const options = {
            method: "GET",
            path: "users/refresh",
            headers: {}
        };
        this.setHeaders(options, true);
        return this.request(options);
    }
    getUsers() {
        return this.basicRead("users");
    }
    getUser(userId) {
        return this.basicRead("users/" + userId);
    }
    createUser(user) {
        return this.basicCreate("users", user);
    }
    updateUser(userId, user) {
        return this.basicUpdate("users/" + userId, user);
    }
    // ---- MAINLY FOR USE IN ADMIN FRONTEND ---- //
    // Studies
    getStudies() {
        return this.basicRead("studies");
    }
    createStudy(study) {
        return this.basicCreate("studies", study);
    }
    updateStudy(studyId, study) {
        return this.basicUpdate("studies/" + studyId, study);
    }
    generateProcedureWithSteps(studyId, procedureScheme) {
        this.basicCreate("studies/" + studyId + "/procedures", procedureScheme);
    }
    getParticipants(studyId) {
        return this.basicRead("studies/" + studyId + "/participants");
    }
    generateParticipants(studyId, amount) {
        const options = {
            method: "POST",
            path: "studies/" + studyId + "/participants",
            headers: {},
            body: { amount: amount },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    populateSurveyParticipants(studyId) {
        return this.basicRead("studies/" + studyId + "/survey-participants");
    }
    // Conditions
    getConditionIds(studyId) {
        const options = {
            method: "GET",
            path: "conditions/ids",
            headers: {},
            body: { study_id: studyId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getCondition(conditionId) {
        return this.basicRead("conditions/" + conditionId);
    }
    createCondition(condition) {
        return this.basicCreate("conditions", condition);
    }
    updateCondition(conditionId, condition) {
        return this.basicUpdate("conditions/" + conditionId, condition);
    }
    getConditions(studyId) {
        return this.basicRead("studies/" + studyId + "/conditions");
    }
    getTasks(studyId) {
        return this.basicRead("studies/" + studyId + "/tasks");
    }
    getTexts(studyId) {
        return this.basicRead("studies/" + studyId + "/texts");
    }
    getQuestionnaires(studyId) {
        return this.basicRead("studies/" + studyId + "/questionnaires");
    }
    getPauses(studyId) {
        return this.basicRead("studies/" + studyId + "/pauses");
    }
    // Procedures
    getProcedures(studyId) {
        const options = {
            method: "GET",
            path: "procedures",
            headers: {},
            body: { study_id: studyId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    // Participants
    getParticipantsByProcedure(procedureId) {
        const options = {
            method: "GET",
            path: "participants",
            headers: {},
            body: { procedure_id: procedureId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getParticipantById(participantId) {
        return this.basicRead("participants/" + participantId);
    }
    endParticipantPause(participantToken) {
        return this.basicRead("participants/" + participantToken + "/end-pause");
    }
    //Tasks
    createTask(task) {
        return this.basicCreate("tasks", task);
    }
    getTask(taskId) {
        return this.basicRead("tasks/" + taskId);
    }
    updateTask(taskId, task) {
        return this.basicUpdate("tasks/" + taskId, task);
    }
    //Texts
    createText(text) {
        return this.basicCreate("texts", text);
    }
    getText(textId) {
        return this.basicRead("texts/" + textId);
    }
    updateText(textId, text) {
        return this.basicUpdate("texts/" + textId, text);
    }
    //Questionnaires
    createQuestionnaire(questionnaire) {
        return this.basicCreate("questionnaires", questionnaire);
    }
    getQuestionnaire(questionnaireId) {
        return this.basicRead("questionnaires/" + questionnaireId);
    }
    updateQuestionnaire(questionnaireId, questionnaire) {
        return this.basicUpdate("questionnaires/" + questionnaireId, questionnaire);
    }
    //Pauses
    createPause(pause) {
        return this.basicCreate("pauses", pause);
    }
    getPause(pauseId) {
        return this.basicRead("pauses/" + pauseId);
    }
    updatePause(pauseId, pause) {
        return this.basicUpdate("pauses/" + pauseId, pause);
    }
    // ---- MAINLY FOR USE IN STUDY FRONTEND ---- //
    //TODO: read condition config
    //Study Frontend related functions
    getStudy(studyId) {
        const options = {
            method: "GET",
            path: "studies/" + (studyId || this.studyId),
        };
        return this.request(options);
    }
    // Participation related methods
    getParticipant(participantToken) {
        const options = {
            method: "GET",
            path: "participants/token/" + participantToken,
        };
        return this.request(options);
    }
    participate(participantToken) {
        let options = {
            method: "GET",
            path: "studies/" + this.studyId + "/participate"
        };
        if (participantToken) {
            options = {
                method: "GET",
                path: "studies/" + this.studyId + "/participate/" + participantToken
            };
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
    readTokens(key = null) {
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
        const options = {
            method: "GET",
            path: "participants/refresh",
            headers: {}
        };
        this.setHeaders(options, true);
        return this.request(options);
    }
    storeLoggerKey(key) {
        localStorage.setItem("loggerKey", key);
    }
    readLoggerKey() {
        return localStorage.getItem("loggerKey");
    }
    deleteLoggerKey() {
        localStorage.removeItem("loggerKey");
    }
    me() {
        const options = {
            method: "GET",
            path: "participants/me",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getProcedure(procedureId) {
        const options = {
            method: "GET",
            path: "procedures/" + procedureId,
            headers: {}
        };
        this.setHeaders(options);
        console.log(options);
        return this.request(options);
    }
    // Helper method to create bulks from interaction lists
    buildBulkList(interactionList, bulkSize = 10) {
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
    logInteractionBulk(path, conditionId, interactionList, bulkSize, logInteractionBulkRequest) {
        const interactionBulks = this.buildBulkList(interactionList, bulkSize);
        const interactionBulkRequests = [];
        for (let i = 0; i < interactionBulks.length; i++) {
            interactionBulkRequests.push(logInteractionBulkRequest(path, conditionId, interactionBulks[i]));
        }
        return Promise.allSettled(interactionBulkRequests);
    }
    logInteractionBulkRequest(path, conditionId, interactions) {
        const options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interactions: interactions
        };
        return this.request(options);
    }
    logInteractionRequest(path, conditionId, interaction) {
        const options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interaction: interaction
        };
        return this.request(options);
    }
    // Mouse Interaction
    logMouseInteraction(conditionId, eventType, mouseEvent, timestamp, relatedTarget = {}, metaData = {}) {
        const interaction = new _interactions__WEBPACK_IMPORTED_MODULE_0__.MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData);
        const path = "interaction/mouse";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addMouseInteraction(eventType, mouseEvent, timestamp, relatedTarget = {}, metaData = {}) {
        this.mouseInteractionList.push(new _interactions__WEBPACK_IMPORTED_MODULE_0__.MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData));
    }
    logMouseInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "mouseInteractionList";
        const path = "interaction/mouse/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Drag Interaction
    logDragInteraction(conditionId, eventType, dragEvent, timestamp, relatedTarget = {}, metaData = {}) {
        const interaction = new _interactions__WEBPACK_IMPORTED_MODULE_0__.DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData);
        const path = "interaction/drag";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addDragInteraction(eventType, dragEvent, timestamp, relatedTarget = {}, metaData = {}) {
        this.dragInteractionList.push(new _interactions__WEBPACK_IMPORTED_MODULE_0__.DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData));
    }
    logDragInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "dragInteractionList";
        const path = "interaction/drag/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Keyboard Interaction
    logKeyboardInteraction(conditionId, eventType, keyboardEvent, timestamp, metaData = {}) {
        const interaction = new _interactions__WEBPACK_IMPORTED_MODULE_0__.KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData);
        const path = "interaction/keyboard";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addKeyboardInteraction(eventType, keyboardEvent, timestamp, metaData = {}) {
        this.keyboardInteractionList.push(new _interactions__WEBPACK_IMPORTED_MODULE_0__.KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData));
    }
    logKeyboardInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "keyboardInteractionList";
        const path = "interaction/keyboard/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Touch Interaction
    logTouchInteraction(conditionId, eventType, touchEvent, timestamp, metaData = {}) {
        const interaction = new _interactions__WEBPACK_IMPORTED_MODULE_0__.TouchInteraction(eventType, timestamp, touchEvent, metaData);
        const path = "interaction/touch";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addTouchInteraction(eventType, touchEvent, timestamp, metaData = {}) {
        this.touchInteractionList.push(new _interactions__WEBPACK_IMPORTED_MODULE_0__.TouchInteraction(eventType, timestamp, touchEvent, metaData));
    }
    logTouchInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "touchInteractionList";
        const path = "interaction/touch/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Generic Interaction
    logGenericInteraction(conditionId, eventType, genericEvent, timestamp, metaData = {}) {
        const interaction = new _interactions__WEBPACK_IMPORTED_MODULE_0__.GenericInteraction(eventType, timestamp, genericEvent, metaData);
        const path = "interaction/generic";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addGenericInteraction(eventType, genericEvent, timestamp, metaData = {}) {
        this.genericInteractionList.push(new _interactions__WEBPACK_IMPORTED_MODULE_0__.GenericInteraction(eventType, timestamp, genericEvent, metaData));
    }
    logGenericInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "genericInteractionList";
        const path = "interaction/generic/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Procedure related methods
    startProcedure() {
        const options = {
            method: "GET",
            path: "procedures/start",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    nextProcedure() {
        const options = {
            method: "GET",
            path: "procedures/next",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    endProcedure() {
        const options = {
            method: "GET",
            path: "procedures/end",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    currentProcedureStep() {
        const options = {
            method: "GET",
            path: "procedure-steps",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    checkSurveyResult() {
        const options = {
            method: "GET",
            path: "procedures/check-survey-result",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    startNavigator() {
        return new Promise((resolve, reject) => {
            // get the user token (uuid)
            this.me().then(response => {
                if (response.body) {
                    const participantToken = response.body.token;
                    const url = this.apiUrl + "/" + "procedures/navigator?participant=" + participantToken;
                    this.sse = new EventSource(url, { withCredentials: true });
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
        const options = {
            method: "GET",
            path: "procedures/navigator/reconnect",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getNavigator() {
        return this.sse;
    }
    updateNavigator(participantToken, source, state, extId) {
        const options = {
            method: "POST",
            path: "procedures/navigator",
            headers: {}
        };
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
StudyAlignLib.getParamsFromURL = () => {
    const url = new URL(window.location.href);
    const studyId = url.searchParams.get("study_id");
    const conditionId = url.searchParams.get("condition_id") || 1; // value from get parameter or 1 (default)
    const loggerKey = url.searchParams.get("logger_key"); // needed for logging
    return {
        studyId: studyId,
        conditionId: conditionId,
        loggerKey: loggerKey
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StudyAlignLib);

})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vc3JjL2ludGVyYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vc3JjL3N0dWR5LWFsaWduLWxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZrQztBQUVs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LFlBQVksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFFM0UsT0FBTztRQUNILE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLFNBQVMsRUFBRSxTQUFTO0tBQ3ZCO0FBQ0wsQ0FBQztBQWlzQkwsaUVBQWUsYUFBYSxFQUFDIiwiZmlsZSI6InN0dWR5LWFsaWduLWxpYi1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInN0dWR5QWxpZ25MaWJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wic3R1ZHlBbGlnbkxpYlwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJzdHVkeUFsaWduTGliXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IHt2NCBhcyB1dWlkdjR9IGZyb20gXCJ1dWlkXCI7XG5cbmNsYXNzIEludGVyYWN0aW9uQmFzZSB7XG4gICAgdXVpZDogc3RyaW5nO1xuICAgIGV2ZW50OiBzdHJpbmc7XG4gICAgdGltZTogbnVtYmVyO1xuICAgIG1ldGFEYXRhOiBvYmplY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIG1ldGFEYXRhOiBvYmplY3QpIHtcbiAgICAgICAgdGhpcy51dWlkID0gdXVpZHY0KCk7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBldmVudFR5cGU7XG4gICAgICAgIHRoaXMudGltZSA9IHRpbWVzdGFtcDtcbiAgICAgICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdXNlSW50ZXJhY3Rpb24gZXh0ZW5kcyBJbnRlcmFjdGlvbkJhc2Uge1xuICAgIHNjcmVlblg6IG51bWJlcjtcbiAgICBzY3JlZW5ZOiBudW1iZXI7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBjdHJsS2V5OiBib29sZWFuO1xuICAgIHNoaWZ0S2V5OiBib29sZWFuO1xuICAgIGFsdEtleTogYm9vbGVhbjtcbiAgICBtZXRhS2V5OiBib29sZWFuO1xuICAgIGJ1dHRvbjogbnVtYmVyO1xuICAgIHJlbGF0ZWRUYXJnZXQ6IG9iamVjdDtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZXZlbnRUeXBlOiBzdHJpbmcsIHRpbWVzdGFtcDogbnVtYmVyLCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCByZWxhdGVkVGFyZ2V0ID0ge30sIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5zY3JlZW5YID0gbW91c2VFdmVudC5zY3JlZW5YO1xuICAgICAgICB0aGlzLnNjcmVlblkgPSBtb3VzZUV2ZW50LnNjcmVlblk7XG4gICAgICAgIHRoaXMuY2xpZW50WCA9IG1vdXNlRXZlbnQuY2xpZW50WDtcbiAgICAgICAgdGhpcy5jbGllbnRZID0gbW91c2VFdmVudC5jbGllbnRZO1xuICAgICAgICB0aGlzLmN0cmxLZXkgPSBtb3VzZUV2ZW50LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSBtb3VzZUV2ZW50LnNoaWZ0S2V5O1xuICAgICAgICB0aGlzLmFsdEtleSA9IG1vdXNlRXZlbnQuYWx0S2V5O1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSBtb3VzZUV2ZW50Lm1ldGFLZXk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gbW91c2VFdmVudC5idXR0b247XG4gICAgICAgIHRoaXMucmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQ7XG4gICAgICAgIHRoaXMueCA9IG1vdXNlRXZlbnQuc2NyZWVuWDtcbiAgICAgICAgdGhpcy55ID0gbW91c2VFdmVudC5zY3JlZW5ZO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERyYWdJbnRlcmFjdGlvbiBleHRlbmRzIE1vdXNlSW50ZXJhY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50VHlwZTogc3RyaW5nLCB0aW1lc3RhbXA6IG51bWJlciwgZHJhZ0V2ZW50OiBEcmFnRXZlbnQsIHJlbGF0ZWRUYXJnZXQgPSB7fSwgbWV0YURhdGEgPSB7fSkge1xuICAgICAgICBzdXBlcihldmVudFR5cGUsIHRpbWVzdGFtcCwgZHJhZ0V2ZW50LCByZWxhdGVkVGFyZ2V0LCBtZXRhRGF0YSk7XG4gICAgfVxufVxuXG5jbGFzcyBUb3VjaEJhc2Uge1xuICAgIHV1aWQ6IHN0cmluZztcbiAgICBhbHRpdHVkZUFuZ2xlOiBudW1iZXI7XG4gICAgYXppbXV0aEFuZ2xlOiBudW1iZXI7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBmb3JjZTogbnVtYmVyO1xuICAgIGlkZW50aWZpZXI6IG51bWJlcjtcbiAgICBzY3JlZW5YOiBudW1iZXI7XG4gICAgc2NyZWVuWTogbnVtYmVyO1xuICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgcGFnZVk6IG51bWJlcjtcbiAgICByYWRpdXNYOiBudW1iZXI7XG4gICAgcmFkaXVzWTogbnVtYmVyO1xuICAgIHJvdGF0aW9uQW5nbGU6IG51bWJlcjtcbiAgICB0YXJnZXQ6IG9iamVjdDtcbiAgICB0b3VjaFR5cGU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHRvdWNoOiBUb3VjaCkge1xuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkdjQoKTtcbiAgICAgICAgdGhpcy5hbHRpdHVkZUFuZ2xlID0gdG91Y2guYWx0aXR1ZGVBbmdsZTtcbiAgICAgICAgdGhpcy5hemltdXRoQW5nbGUgPSB0b3VjaC5hemltdXRoQW5nbGU7XG4gICAgICAgIHRoaXMuY2xpZW50WCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuY2xpZW50WSA9IHRvdWNoLmNsaWVudFk7XG4gICAgICAgIHRoaXMuZm9yY2UgPSB0b3VjaC5mb3JjZTtcbiAgICAgICAgdGhpcy5pZGVudGlmaWVyID0gdG91Y2guaWRlbnRpZmllcjtcbiAgICAgICAgdGhpcy5wYWdlWCA9IHRvdWNoLnBhZ2VYO1xuICAgICAgICB0aGlzLnBhZ2VZID0gdG91Y2gucGFnZVk7XG4gICAgICAgIHRoaXMucmFkaXVzWCA9IHRvdWNoLnJhZGl1c1g7XG4gICAgICAgIHRoaXMucmFkaXVzWSA9IHRvdWNoLnJhZGl1c1k7XG4gICAgICAgIHRoaXMucm90YXRpb25BbmdsZSA9IHRvdWNoLnJvdGF0aW9uQW5nbGU7XG4gICAgICAgIHRoaXMuc2NyZWVuWCA9IHRvdWNoLnNjcmVlblg7XG4gICAgICAgIHRoaXMuc2NyZWVuWSA9IHRvdWNoLnNjcmVlblk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdG91Y2gudGFyZ2V0O1xuICAgICAgICB0aGlzLnRvdWNoVHlwZSA9IHRvdWNoLnRvdWNoVHlwZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUb3VjaEludGVyYWN0aW9uIGV4dGVuZHMgSW50ZXJhY3Rpb25CYXNlIHtcbiAgICBhbHRLZXk6IGJvb2xlYW47XG4gICAgY3RybEtleTogYm9vbGVhbjtcbiAgICBtZXRhS2V5OiBib29sZWFuO1xuICAgIHNoaWZ0S2V5OiBib29sZWFuO1xuICAgIG1ldGFEYXRhOiBvYmplY3Q7XG5cbiAgICBjaGFuZ2VkVG91Y2hlczogVG91Y2hCYXNlW10gPSBbXTtcbiAgICB0YXJnZXRUb3VjaGVzOiBUb3VjaEJhc2VbXSA9IFtdO1xuICAgIHRvdWNoZXM6IFRvdWNoQmFzZVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIHRvdWNoRXZlbnQ6IFRvdWNoRXZlbnQsIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSB0b3VjaEV2ZW50LmFsdEtleTtcbiAgICAgICAgdGhpcy5jdHJsS2V5ID0gdG91Y2hFdmVudC5jdHJsS2V5O1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSB0b3VjaEV2ZW50Lm1ldGFLZXk7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSB0b3VjaEV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgIGlmICh0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dG91Y2hFdmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFRvdWNoZXMucHVzaChuZXcgVG91Y2hCYXNlKHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXNbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3VjaEV2ZW50LnRhcmdldFRvdWNoZXMgJiYgdG91Y2hFdmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRvdWNoRXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0VG91Y2hlcy5wdXNoKG5ldyBUb3VjaEJhc2UodG91Y2hFdmVudC50YXJnZXRUb3VjaGVzW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG91Y2hFdmVudC50b3VjaGVzICYmIHRvdWNoRXZlbnQudG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0b3VjaEV2ZW50LnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdWNoZXMucHVzaChuZXcgVG91Y2hCYXNlKHRvdWNoRXZlbnQudG91Y2hlc1tpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnRlcmFjdGlvbiBleHRlbmRzIEludGVyYWN0aW9uQmFzZSB7XG4gICAgYWx0S2V5OiBib29sZWFuO1xuICAgIGNvZGU6IHN0cmluZztcbiAgICBpc0NvbXBvc2luZzogYm9vbGVhbjtcbiAgICBrZXk6IHN0cmluZztcbiAgICAvL2xvY2FsZTogc3RyaW5nO1xuICAgIGxvY2F0aW9uOiBudW1iZXI7XG4gICAgbWV0YUtleTogYm9vbGVhbjtcbiAgICByZXBlYXQ6IGJvb2xlYW47XG4gICAgc2hpZnRLZXk6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQsIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSBrZXlib2FyZEV2ZW50LmFsdEtleTtcbiAgICAgICAgdGhpcy5jb2RlID0ga2V5Ym9hcmRFdmVudC5jb2RlO1xuICAgICAgICB0aGlzLmlzQ29tcG9zaW5nID0ga2V5Ym9hcmRFdmVudC5pc0NvbXBvc2luZztcbiAgICAgICAgdGhpcy5rZXkgPSBrZXlib2FyZEV2ZW50LmtleTtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGtleWJvYXJkRXZlbnQubG9jYXRpb247XG4gICAgICAgIHRoaXMubWV0YUtleSA9IGtleWJvYXJkRXZlbnQubWV0YUtleTtcbiAgICAgICAgdGhpcy5yZXBlYXQgPSBrZXlib2FyZEV2ZW50LnJlcGVhdDtcbiAgICAgICAgdGhpcy5zaGlmdEtleSA9IGtleWJvYXJkRXZlbnQuc2hpZnRLZXk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2VuZXJpY0ludGVyYWN0aW9uIGV4dGVuZHMgSW50ZXJhY3Rpb25CYXNlIHtcbiAgICBkYXRhOiBvYmplY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIGdlbmVyaWNFdmVudERhdGE6IG9iamVjdCwgbWV0YURhdGEgPSB7fSkge1xuICAgICAgICBzdXBlcihldmVudFR5cGUsIHRpbWVzdGFtcCwgbWV0YURhdGEpO1xuICAgICAgICB0aGlzLmRhdGEgPSBnZW5lcmljRXZlbnREYXRhO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG52YXIgZ2V0UmFuZG9tVmFsdWVzO1xudmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uIEFsc28sXG4gICAgLy8gZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIChtc0NyeXB0bykgb24gSUUxMS5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pIHx8IHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byk7XG5cbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCkgbm90IHN1cHBvcnRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCNnZXRyYW5kb212YWx1ZXMtbm90LXN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG52YXIgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIpIHtcbiAgdmFyIG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHZhciB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7XG4gICAgRHJhZ0ludGVyYWN0aW9uLFxuICAgIEdlbmVyaWNJbnRlcmFjdGlvbixcbiAgICBLZXlib2FyZEludGVyYWN0aW9uLFxuICAgIE1vdXNlSW50ZXJhY3Rpb24sXG4gICAgVG91Y2hJbnRlcmFjdGlvblxufSBmcm9tIFwiLi9pbnRlcmFjdGlvbnNcIjtcblxuY2xhc3MgU3R1ZHlBbGlnbkxpYiB7XG5cbiAgICBhcGlWZXJzaW9uOiBzdHJpbmc7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgc3R1ZHlJZDogbnVtYmVyO1xuICAgIGFwaVVybDogc3RyaW5nO1xuICAgIHNzZTogRXZlbnRTb3VyY2U7XG5cbiAgICAvLyBJbnRlcmFjdGlvbiBMaXN0cyAoV2ViIEV2ZW50cyBvbmx5KSwgbmVlZGVkIGZvciBidWxrIHNhdmluZ1xuICAgIG1vdXNlSW50ZXJhY3Rpb25MaXN0OiBNb3VzZUludGVyYWN0aW9uW10gPSBbXTtcbiAgICBkcmFnSW50ZXJhY3Rpb25MaXN0OiBEcmFnSW50ZXJhY3Rpb25bXSA9IFtdO1xuICAgIGtleWJvYXJkSW50ZXJhY3Rpb25MaXN0OiBLZXlib2FyZEludGVyYWN0aW9uW10gPSBbXTtcbiAgICB0b3VjaEludGVyYWN0aW9uTGlzdDogVG91Y2hJbnRlcmFjdGlvbltdID0gW107XG4gICAgZ2VuZXJpY0ludGVyYWN0aW9uTGlzdDogR2VuZXJpY0ludGVyYWN0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCIsIHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmFwaVZlcnNpb24gPSBcInYxXCI7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLnN0dWR5SWQgPSBzdHVkeUlkO1xuICAgICAgICB0aGlzLmFwaVVybCA9IHRoaXMudXJsICsgXCIvYXBpL1wiICsgdGhpcy5hcGlWZXJzaW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQYXJhbXNGcm9tVVJMID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgY29uc3Qgc3R1ZHlJZCA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwic3R1ZHlfaWRcIik7XG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbklkID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJjb25kaXRpb25faWRcIikgfHwgMTsgLy8gdmFsdWUgZnJvbSBnZXQgcGFyYW1ldGVyIG9yIDEgKGRlZmF1bHQpXG4gICAgICAgIGNvbnN0IGxvZ2dlcktleSA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwibG9nZ2VyX2tleVwiKTsgLy8gbmVlZGVkIGZvciBsb2dnaW5nXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0dWR5SWQ6IHN0dWR5SWQsXG4gICAgICAgICAgICBjb25kaXRpb25JZDogY29uZGl0aW9uSWQsXG4gICAgICAgICAgICBsb2dnZXJLZXk6IGxvZ2dlcktleVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGltZXN0YW1wKCkge1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3c7XG4gICAgfVxuXG4gICAgZ2V0VGltZXN0YW1wV2l0aE9mZnNldCgpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGRhdGUuc2V0TWludXRlcyhkYXRlLmdldE1pbnV0ZXMoKSArICgtMSAqIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSkpXG4gICAgICAgIHJldHVybiBkYXRlLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICBzZXRIZWFkZXJzKG9wdGlvbnM6IE9wdGlvbnMsIHJlZnJlc2g6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBhY2Nlc3NfdG9rZW4gPSAhcmVmcmVzaCA/IHRoaXMucmVhZFRva2VucyhcImFjY2Vzc190b2tlblwiKSA6IHRoaXMucmVhZFRva2VucyhcInJlZnJlc2hfdG9rZW5cIik7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVyc1tcIkF1dGhvcml6YXRpb25cIl0gPSBcIkJlYXJlciBcIiArIGFjY2Vzc190b2tlbjtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzW1wiQ29udGVudC10eXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gICAgfVxuXG4gICAgc2V0TG9nZ2VySGVhZGVycyhvcHRpb25zOiBPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGxvZ2dlcktleSA9IHRoaXMucmVhZExvZ2dlcktleSgpO1xuICAgICAgICBpZiAobG9nZ2VyS2V5KSB7XG4gICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJTdHVkeWFsaWduLUxvZ2dlci1LZXlcIl0gPSBsb2dnZXJLZXk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzW1wiQ29udGVudC10eXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gICAgfVxuXG4gICAgcmVxdWVzdChvcHRpb25zOiBPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGVuY29kZVBhcmFtcyA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZGF0YSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtrZXldKTtcbiAgICAgICAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLmFwaVVybCArIFwiL1wiICsgb3B0aW9ucy5wYXRoO1xuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIHVybCk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vbmxvYWQpIHtcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gb3B0aW9ucy5vbmxvYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogeGhyLnJlc3BvbnNlID8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpIDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk6IG9wdGlvbnMuYm9keVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMub25wcm9ncmVzcykge1xuICAgICAgICAgICAgICAgIHhoci5vbnByb2dyZXNzID0gb3B0aW9ucy5vbnByb2dyZXNzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMub25lcnJvcikge1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gb3B0aW9ucy5vbmVycm9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEJvZHk6IG9wdGlvbnMuYm9keVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5oZWFkZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBvcHRpb25zLmhlYWRlcnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIikge1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBvcHRpb25zLnBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgZW5jb2RlZFBhcmFtcyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiB0eXBlb2YgcGFyYW1zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBlbmNvZGVkUGFyYW1zID0gZW5jb2RlUGFyYW1zKHBhcmFtcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoZW5jb2RlZFBhcmFtcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gXCJQT1NUXCIgfHwgb3B0aW9ucy5tZXRob2QgPT09IFwiUEFUQ0hcIikge1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG9wdGlvbnMuZm9ybURhdGEgPyBlbmNvZGVQYXJhbXMob3B0aW9ucy5ib2R5KSA6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9keSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiYXNpY0NyZWF0ZShwYXRoOiBzdHJpbmcsIGRhdGE6IG9iamVjdCkge1xuICAgICAgICBsZXQgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMuYm9keSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYmFzaWNSZWFkKHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGJhc2ljVXBkYXRlKHBhdGg6IHN0cmluZywgZGF0YTogb2JqZWN0KSB7XG4gICAgICAgIGxldCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMuYm9keSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gQWRtaW4gcmVsYXRlZCBmdW5jdGlvbnNcbiAgICB1c2VyTG9naW4odXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHBhdGg6IFwidXNlcnMvbG9naW5cIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgYm9keToge3VzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkfSxcbiAgICAgICAgICAgIGZvcm1EYXRhOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMuaGVhZGVyc1tcIkNvbnRlbnQtdHlwZVwiXSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgdXNlck1lKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInVzZXJzL21lXCIpO1xuICAgIH1cblxuICAgIHVzZXJSZWZyZXNoVG9rZW4oKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInVzZXJzL3JlZnJlc2hcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldFVzZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJ1c2Vyc1wiKTtcbiAgICB9XG5cbiAgICBnZXRVc2VyKHVzZXJJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInVzZXJzL1wiICsgdXNlcklkKTtcbiAgICB9XG5cbiAgICBjcmVhdGVVc2VyKHVzZXI6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInVzZXJzXCIsIHVzZXIpXG4gICAgfVxuXG4gICAgdXBkYXRlVXNlcih1c2VySWQ6IG51bWJlciwgdXNlcjogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwidXNlcnMvXCIgKyB1c2VySWQsIHVzZXIpO1xuICAgIH1cblxuICAgIC8vIC0tLS0gTUFJTkxZIEZPUiBVU0UgSU4gQURNSU4gRlJPTlRFTkQgLS0tLSAvL1xuXG4gICAgLy8gU3R1ZGllc1xuXG4gICAgZ2V0U3R1ZGllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllc1wiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTdHVkeShzdHVkeTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljQ3JlYXRlKFwic3R1ZGllc1wiLCBzdHVkeSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU3R1ZHkoc3R1ZHlJZDogbnVtYmVyLCBzdHVkeTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwic3R1ZGllcy9cIiArIHN0dWR5SWQsIHN0dWR5KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVByb2NlZHVyZVdpdGhTdGVwcyhzdHVkeUlkOiBudW1iZXIsIHByb2NlZHVyZVNjaGVtZTogb2JqZWN0KSB7XG4gICAgICAgIHRoaXMuYmFzaWNDcmVhdGUoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3Byb2NlZHVyZXNcIiwgcHJvY2VkdXJlU2NoZW1lKTtcbiAgICB9XG5cbiAgICBnZXRQYXJ0aWNpcGFudHMoc3R1ZHlJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvcGFydGljaXBhbnRzXCIpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlUGFydGljaXBhbnRzKHN0dWR5SWQ6IG51bWJlciwgYW1vdW50OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvcGFydGljaXBhbnRzXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGJvZHk6IHthbW91bnQ6IGFtb3VudH0sXG4gICAgICAgICAgICBmb3JtRGF0YTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcG9wdWxhdGVTdXJ2ZXlQYXJ0aWNpcGFudHMoc3R1ZHlJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvc3VydmV5LXBhcnRpY2lwYW50c1wiKTtcbiAgICB9XG5cbiAgICAvLyBDb25kaXRpb25zXG5cbiAgICBnZXRDb25kaXRpb25JZHMoc3R1ZHlJZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcImNvbmRpdGlvbnMvaWRzXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGJvZHk6IHtzdHVkeV9pZDogc3R1ZHlJZH0sXG4gICAgICAgICAgICBmb3JtRGF0YTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0Q29uZGl0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwiY29uZGl0aW9ucy9cIiArIGNvbmRpdGlvbklkKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb25kaXRpb24oY29uZGl0aW9uOiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNDcmVhdGUoXCJjb25kaXRpb25zXCIsIGNvbmRpdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlQ29uZGl0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIsIGNvbmRpdGlvbjogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwiY29uZGl0aW9ucy9cIiArIGNvbmRpdGlvbklkLCBjb25kaXRpb24pO1xuICAgIH1cblxuICAgIGdldENvbmRpdGlvbnMoc3R1ZHlJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvY29uZGl0aW9uc1wiKTtcbiAgICB9XG5cbiAgICBnZXRUYXNrcyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi90YXNrc1wiKTtcbiAgICB9XG5cbiAgICBnZXRUZXh0cyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi90ZXh0c1wiKTtcbiAgICB9XG5cbiAgICBnZXRRdWVzdGlvbm5haXJlcyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi9xdWVzdGlvbm5haXJlc1wiKTtcbiAgICB9XG5cbiAgICBnZXRQYXVzZXMoc3R1ZHlJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvcGF1c2VzXCIpO1xuICAgIH1cblxuXG4gICAgLy8gUHJvY2VkdXJlc1xuXG4gICAgZ2V0UHJvY2VkdXJlcyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwicHJvY2VkdXJlc1wiLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBib2R5OiB7c3R1ZHlfaWQ6IHN0dWR5SWR9LFxuICAgICAgICAgICAgZm9ybURhdGE6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIFBhcnRpY2lwYW50c1xuXG4gICAgZ2V0UGFydGljaXBhbnRzQnlQcm9jZWR1cmUocHJvY2VkdXJlSWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwYXJ0aWNpcGFudHNcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICAgICAgYm9keToge3Byb2NlZHVyZV9pZDogcHJvY2VkdXJlSWR9LFxuICAgICAgICAgICAgZm9ybURhdGE6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldFBhcnRpY2lwYW50QnlJZChwYXJ0aWNpcGFudElkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwicGFydGljaXBhbnRzL1wiICsgcGFydGljaXBhbnRJZCk7XG4gICAgfVxuXG4gICAgZW5kUGFydGljaXBhbnRQYXVzZShwYXJ0aWNpcGFudFRva2VuOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwicGFydGljaXBhbnRzL1wiICsgcGFydGljaXBhbnRUb2tlbiArIFwiL2VuZC1wYXVzZVwiKTtcbiAgICB9XG5cbiAgICAvL1Rhc2tzXG5cbiAgICBjcmVhdGVUYXNrKHRhc2s6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInRhc2tzXCIsIHRhc2spO1xuICAgIH1cblxuICAgIGdldFRhc2sodGFza0lkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwidGFza3MvXCIgKyB0YXNrSWQpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRhc2sodGFza0lkOiBudW1iZXIsIHRhc2s6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInRhc2tzL1wiICsgdGFza0lkLCB0YXNrKTtcbiAgICB9XG5cbiAgICAvL1RleHRzXG5cbiAgICBjcmVhdGVUZXh0KHRleHQ6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInRleHRzXCIsIHRleHQpO1xuICAgIH1cblxuICAgIGdldFRleHQodGV4dElkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwidGV4dHMvXCIgKyB0ZXh0SWQpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRleHQodGV4dElkOiBudW1iZXIsIHRleHQ6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInRleHRzL1wiICsgdGV4dElkLCB0ZXh0KTtcbiAgICB9XG5cbiAgICAvL1F1ZXN0aW9ubmFpcmVzXG5cbiAgICBjcmVhdGVRdWVzdGlvbm5haXJlKHF1ZXN0aW9ubmFpcmU6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInF1ZXN0aW9ubmFpcmVzXCIsIHF1ZXN0aW9ubmFpcmUpO1xuICAgIH1cblxuICAgIGdldFF1ZXN0aW9ubmFpcmUocXVlc3Rpb25uYWlyZUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwicXVlc3Rpb25uYWlyZXMvXCIgKyBxdWVzdGlvbm5haXJlSWQpO1xuICAgIH1cblxuICAgIHVwZGF0ZVF1ZXN0aW9ubmFpcmUocXVlc3Rpb25uYWlyZUlkOiBudW1iZXIsIHF1ZXN0aW9ubmFpcmU6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInF1ZXN0aW9ubmFpcmVzL1wiICsgcXVlc3Rpb25uYWlyZUlkLCBxdWVzdGlvbm5haXJlKTtcbiAgICB9XG5cbiAgICAvL1BhdXNlc1xuXG4gICAgY3JlYXRlUGF1c2UocGF1c2U6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInBhdXNlc1wiLCBwYXVzZSk7XG4gICAgfVxuXG4gICAgZ2V0UGF1c2UocGF1c2VJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInBhdXNlcy9cIiArIHBhdXNlSWQpO1xuICAgIH1cblxuICAgIHVwZGF0ZVBhdXNlKHBhdXNlSWQ6IG51bWJlciwgcGF1c2U6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInBhdXNlcy9cIiArIHBhdXNlSWQsIHBhdXNlKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tIE1BSU5MWSBGT1IgVVNFIElOIFNUVURZIEZST05URU5EIC0tLS0gLy9cblxuICAgIC8vVE9ETzogcmVhZCBjb25kaXRpb24gY29uZmlnXG5cbiAgICAvL1N0dWR5IEZyb250ZW5kIHJlbGF0ZWQgZnVuY3Rpb25zXG5cbiAgICBnZXRTdHVkeShzdHVkeUlkPzogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInN0dWRpZXMvXCIgKyAoc3R1ZHlJZCB8fCB0aGlzLnN0dWR5SWQpLFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gUGFydGljaXBhdGlvbiByZWxhdGVkIG1ldGhvZHNcblxuICAgIGdldFBhcnRpY2lwYW50KHBhcnRpY2lwYW50VG9rZW46IHN0cmluZykge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwYXJ0aWNpcGFudHMvdG9rZW4vXCIgKyBwYXJ0aWNpcGFudFRva2VuLFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcGFydGljaXBhdGUocGFydGljaXBhbnRUb2tlbj86IHN0cmluZykge1xuICAgICAgICBsZXQgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwic3R1ZGllcy9cIiArIHRoaXMuc3R1ZHlJZCArIFwiL3BhcnRpY2lwYXRlXCJcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydGljaXBhbnRUb2tlbikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgcGF0aDogXCJzdHVkaWVzL1wiICsgdGhpcy5zdHVkeUlkICsgXCIvcGFydGljaXBhdGUvXCIgKyBwYXJ0aWNpcGFudFRva2VuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzdG9yZVRva2VucyhyZXNwb25zZUpzb24pIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlbnNcIiwgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VKc29uKSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQWNjZXNzVG9rZW4ocmVzcG9uc2VKc29uKSB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMucmVhZFRva2VucygpO1xuICAgICAgICB0b2tlbnNbXCJhY2Nlc3NfdG9rZW5cIl0gPSByZXNwb25zZUpzb25bXCJhY2Nlc3NfdG9rZW5cIl07XG4gICAgICAgIHRoaXMuc3RvcmVUb2tlbnModG9rZW5zKTtcbiAgICB9XG5cbiAgICByZWFkVG9rZW5zKGtleT0gbnVsbCkge1xuICAgICAgICBsZXQgdG9rZW5zID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlbnNcIik7XG4gICAgICAgIGlmICh0b2tlbnMpIHtcbiAgICAgICAgICAgIHRva2VucyA9IEpTT04ucGFyc2UodG9rZW5zKTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW5zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRlbGV0ZVRva2VucygpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlbnNcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaFRva2VuKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwYXJ0aWNpcGFudHMvcmVmcmVzaFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc3RvcmVMb2dnZXJLZXkoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJsb2dnZXJLZXlcIiwga2V5KTtcbiAgICB9XG5cbiAgICByZWFkTG9nZ2VyS2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImxvZ2dlcktleVwiKTtcbiAgICB9XG5cbiAgICBkZWxldGVMb2dnZXJLZXkoKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwibG9nZ2VyS2V5XCIpO1xuICAgIH1cblxuICAgIG1lKCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInBhcnRpY2lwYW50cy9tZVwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0UHJvY2VkdXJlKHByb2NlZHVyZUlkOiBudW1iZXIpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL1wiICsgcHJvY2VkdXJlSWQsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIG1ldGhvZCB0byBjcmVhdGUgYnVsa3MgZnJvbSBpbnRlcmFjdGlvbiBsaXN0c1xuICAgIHByaXZhdGUgYnVpbGRCdWxrTGlzdChpbnRlcmFjdGlvbkxpc3Q6IEludGVyYWN0aW9uVHlwZXMsIGJ1bGtTaXplOiBudW1iZXIgPSAxMCkge1xuICAgICAgICBjb25zdCBidWxrcyA9IFtdO1xuICAgICAgICB3aGlsZSAodGhpc1tpbnRlcmFjdGlvbkxpc3RdLmxlbmd0aCA+IGJ1bGtTaXplKSB7XG4gICAgICAgICAgICBidWxrcy5wdXNoKHRoaXNbaW50ZXJhY3Rpb25MaXN0XS5zcGxpY2UoMCwgYnVsa1NpemUpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpc1tpbnRlcmFjdGlvbkxpc3RdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJ1bGtzLnB1c2godGhpc1tpbnRlcmFjdGlvbkxpc3RdLnNwbGljZSgwLCB0aGlzW2ludGVyYWN0aW9uTGlzdF0ubGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1bGtzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHR5cGUgY2FsbGJhY2sgY29ycmVjdGx5LCBzdGFydGluZyBwb2ludCBjb3VsZCBiZSAoY29uZGl0aW9uSWQ6IG51bWJlciwgaW50ZXJhY3Rpb25zOiBvYmplY3RbXSkgPT4gUHJvbWlzZTxhbnk+XG4gICAgbG9nSW50ZXJhY3Rpb25CdWxrKHBhdGg6IHN0cmluZywgY29uZGl0aW9uSWQ6IG51bWJlciwgaW50ZXJhY3Rpb25MaXN0OiBJbnRlcmFjdGlvblR5cGVzLCBidWxrU2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdCkge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbkJ1bGtzID0gdGhpcy5idWlsZEJ1bGtMaXN0KGludGVyYWN0aW9uTGlzdCwgYnVsa1NpemUpO1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyYWN0aW9uQnVsa3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGludGVyYWN0aW9uQnVsa1JlcXVlc3RzLnB1c2gobG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdChwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb25CdWxrc1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbFNldHRsZWQoaW50ZXJhY3Rpb25CdWxrUmVxdWVzdHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdChwYXRoOiBzdHJpbmcsIGNvbmRpdGlvbklkOiBudW1iZXIsIGludGVyYWN0aW9uczogb2JqZWN0W10pIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldExvZ2dlckhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMuYm9keSA9IHtcbiAgICAgICAgICAgIGNvbmRpdGlvbl9pZDogY29uZGl0aW9uSWQsXG4gICAgICAgICAgICBpbnRlcmFjdGlvbnM6IGludGVyYWN0aW9uc1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9nSW50ZXJhY3Rpb25SZXF1ZXN0KHBhdGg6IHN0cmluZywgY29uZGl0aW9uSWQ6IG51bWJlciwgaW50ZXJhY3Rpb246IG9iamVjdCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TG9nZ2VySGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucy5ib2R5ID0ge1xuICAgICAgICAgICAgY29uZGl0aW9uX2lkOiBjb25kaXRpb25JZCxcbiAgICAgICAgICAgIGludGVyYWN0aW9uOiBpbnRlcmFjdGlvblxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIE1vdXNlIEludGVyYWN0aW9uXG5cbiAgICBsb2dNb3VzZUludGVyYWN0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIsIGV2ZW50VHlwZTogc3RyaW5nLCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCB0aW1lc3RhbXA6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHt9ID0ge30sIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IE1vdXNlSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1vdXNlRXZlbnQsIHJlbGF0ZWRUYXJnZXQsIG1ldGFEYXRhKTtcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vbW91c2VcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25SZXF1ZXN0KHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvbik7XG4gICAgfVxuXG4gICAgYWRkTW91c2VJbnRlcmFjdGlvbihldmVudFR5cGU6IHN0cmluZywgbW91c2VFdmVudDogTW91c2VFdmVudCwgdGltZXN0YW1wOiBudW1iZXIsIHJlbGF0ZWRUYXJnZXQ6IHt9ID0ge30sIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIHRoaXMubW91c2VJbnRlcmFjdGlvbkxpc3QucHVzaChuZXcgTW91c2VJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgbW91c2VFdmVudCwgcmVsYXRlZFRhcmdldCwgbWV0YURhdGEpKTtcbiAgICB9XG5cbiAgICBsb2dNb3VzZUludGVyYWN0aW9uQnVsayhjb25kaXRpb25JZDogbnVtYmVyLCBidWxrU2l6ZTogbnVtYmVyID0gMTApOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvblR5cGUgPSBcIm1vdXNlSW50ZXJhY3Rpb25MaXN0XCJcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vbW91c2UvYnVsa1wiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGsocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uVHlwZSwgYnVsa1NpemUsIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBEcmFnIEludGVyYWN0aW9uXG5cbiAgICBsb2dEcmFnSW50ZXJhY3Rpb24oY29uZGl0aW9uSWQ6IG51bWJlciwgZXZlbnRUeXBlOiBzdHJpbmcsIGRyYWdFdmVudDogRHJhZ0V2ZW50LCB0aW1lc3RhbXA6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHt9ID0ge30sIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IERyYWdJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgZHJhZ0V2ZW50LCByZWxhdGVkVGFyZ2V0LCBtZXRhRGF0YSk7XG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL2RyYWdcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25SZXF1ZXN0KHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvbik7XG4gICAgfVxuXG4gICAgYWRkRHJhZ0ludGVyYWN0aW9uKGV2ZW50VHlwZTogc3RyaW5nLCBkcmFnRXZlbnQ6IERyYWdFdmVudCwgdGltZXN0YW1wOiBudW1iZXIsIHJlbGF0ZWRUYXJnZXQ6IHt9ID0ge30sIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIHRoaXMuZHJhZ0ludGVyYWN0aW9uTGlzdC5wdXNoKG5ldyBEcmFnSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIGRyYWdFdmVudCwgcmVsYXRlZFRhcmdldCwgbWV0YURhdGEpKTtcbiAgICB9XG5cbiAgICBsb2dEcmFnSW50ZXJhY3Rpb25CdWxrKGNvbmRpdGlvbklkOiBudW1iZXIsIGJ1bGtTaXplOiBudW1iZXIgPSAxMCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uVHlwZSA9IFwiZHJhZ0ludGVyYWN0aW9uTGlzdFwiXG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL2RyYWcvYnVsa1wiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGsocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uVHlwZSwgYnVsa1NpemUsIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBLZXlib2FyZCBJbnRlcmFjdGlvblxuXG4gICAgbG9nS2V5Ym9hcmRJbnRlcmFjdGlvbihjb25kaXRpb25JZDogbnVtYmVyLCBldmVudFR5cGU6IHN0cmluZywga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCwgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBLZXlib2FyZEludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCBrZXlib2FyZEV2ZW50LCBtZXRhRGF0YSk7XG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL2tleWJvYXJkXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uUmVxdWVzdChwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb24pO1xuICAgIH1cblxuICAgIGFkZEtleWJvYXJkSW50ZXJhY3Rpb24oZXZlbnRUeXBlOiBzdHJpbmcsIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQsIHRpbWVzdGFtcDogbnVtYmVyLCBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICB0aGlzLmtleWJvYXJkSW50ZXJhY3Rpb25MaXN0LnB1c2gobmV3IEtleWJvYXJkSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIGtleWJvYXJkRXZlbnQsIG1ldGFEYXRhKSk7XG4gICAgfVxuXG4gICAgbG9nS2V5Ym9hcmRJbnRlcmFjdGlvbkJ1bGsoY29uZGl0aW9uSWQ6IG51bWJlciwgYnVsa1NpemU6IG51bWJlciA9IDEwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25UeXBlID0gXCJrZXlib2FyZEludGVyYWN0aW9uTGlzdFwiXG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL2tleWJvYXJkL2J1bGtcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrKHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvblR5cGUsIGJ1bGtTaXplLCB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsa1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8gVG91Y2ggSW50ZXJhY3Rpb25cblxuICAgIGxvZ1RvdWNoSW50ZXJhY3Rpb24oY29uZGl0aW9uSWQ6IG51bWJlciwgZXZlbnRUeXBlOiBzdHJpbmcsIHRvdWNoRXZlbnQ6IFRvdWNoRXZlbnQsIHRpbWVzdGFtcDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgVG91Y2hJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgdG91Y2hFdmVudCwgbWV0YURhdGEpO1xuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi90b3VjaFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvblJlcXVlc3QocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRUb3VjaEludGVyYWN0aW9uKGV2ZW50VHlwZTogc3RyaW5nLCB0b3VjaEV2ZW50OiBUb3VjaEV2ZW50LCB0aW1lc3RhbXA6IG51bWJlciwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgdGhpcy50b3VjaEludGVyYWN0aW9uTGlzdC5wdXNoKG5ldyBUb3VjaEludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCB0b3VjaEV2ZW50LCBtZXRhRGF0YSkpO1xuICAgIH1cblxuICAgIGxvZ1RvdWNoSW50ZXJhY3Rpb25CdWxrKGNvbmRpdGlvbklkOiBudW1iZXIsIGJ1bGtTaXplOiBudW1iZXIgPSAxMCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uVHlwZSA9IFwidG91Y2hJbnRlcmFjdGlvbkxpc3RcIlxuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi90b3VjaC9idWxrXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsayhwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb25UeXBlLCBidWxrU2l6ZSwgdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIEdlbmVyaWMgSW50ZXJhY3Rpb25cblxuICAgIGxvZ0dlbmVyaWNJbnRlcmFjdGlvbihjb25kaXRpb25JZDogbnVtYmVyLCBldmVudFR5cGU6IHN0cmluZywgZ2VuZXJpY0V2ZW50OiBvYmplY3QsIHRpbWVzdGFtcDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgR2VuZXJpY0ludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCBnZW5lcmljRXZlbnQsIG1ldGFEYXRhKTtcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vZ2VuZXJpY1wiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvblJlcXVlc3QocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRHZW5lcmljSW50ZXJhY3Rpb24oZXZlbnRUeXBlOiBzdHJpbmcsIGdlbmVyaWNFdmVudDogb2JqZWN0LCB0aW1lc3RhbXA6IG51bWJlciwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgdGhpcy5nZW5lcmljSW50ZXJhY3Rpb25MaXN0LnB1c2gobmV3IEdlbmVyaWNJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgZ2VuZXJpY0V2ZW50LCBtZXRhRGF0YSkpO1xuICAgIH1cblxuICAgIGxvZ0dlbmVyaWNJbnRlcmFjdGlvbkJ1bGsoY29uZGl0aW9uSWQ6IG51bWJlciwgYnVsa1NpemU6IG51bWJlciA9IDEwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25UeXBlID0gXCJnZW5lcmljSW50ZXJhY3Rpb25MaXN0XCJcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vZ2VuZXJpYy9idWxrXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsayhwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb25UeXBlLCBidWxrU2l6ZSwgdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIFByb2NlZHVyZSByZWxhdGVkIG1ldGhvZHNcblxuICAgIHN0YXJ0UHJvY2VkdXJlKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL3N0YXJ0XCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBuZXh0UHJvY2VkdXJlKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL25leHRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGVuZFByb2NlZHVyZSgpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwicHJvY2VkdXJlcy9lbmRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGN1cnJlbnRQcm9jZWR1cmVTdGVwKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmUtc3RlcHNcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNoZWNrU3VydmV5UmVzdWx0KCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL2NoZWNrLXN1cnZleS1yZXN1bHRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHN0YXJ0TmF2aWdhdG9yKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgdXNlciB0b2tlbiAodXVpZClcbiAgICAgICAgICAgIHRoaXMubWUoKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuYm9keSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJ0aWNpcGFudFRva2VuID0gcmVzcG9uc2UuYm9keS50b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdGhpcy5hcGlVcmwgKyBcIi9cIiArIFwicHJvY2VkdXJlcy9uYXZpZ2F0b3I/cGFydGljaXBhbnQ9XCIgKyBwYXJ0aWNpcGFudFRva2VuO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNzZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwsIHt3aXRoQ3JlZGVudGlhbHM6IHRydWV9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJQYXJ0aWNpcGFudCBub3QgZm91bmRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjbG9zZU5hdmlnYXRvcigpIHtcbiAgICAgICAgdGhpcy5zc2UuY2xvc2UoKTtcbiAgICB9XG5cbiAgICByZWNvbm5lY3ROYXZpZ2F0b3IoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZXMvbmF2aWdhdG9yL3JlY29ubmVjdFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0TmF2aWdhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zc2U7XG4gICAgfVxuXG4gICAgdXBkYXRlTmF2aWdhdG9yKHBhcnRpY2lwYW50VG9rZW46IHN0cmluZywgc291cmNlOiBOYXZpZ2F0b3JTb3VyY2UsIHN0YXRlOiBOYXZpZ2F0b3JTdGF0ZSwgZXh0SWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHBhdGg6IFwicHJvY2VkdXJlcy9uYXZpZ2F0b3JcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLmJvZHkgPSB7XG4gICAgICAgICAgICBwYXJ0aWNpcGFudF90b2tlbjogcGFydGljaXBhbnRUb2tlbixcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgZXh0X2lkOiBleHRJZFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgU3R1ZHlBbGlnbkxpYjsiXSwic291cmNlUm9vdCI6IiJ9