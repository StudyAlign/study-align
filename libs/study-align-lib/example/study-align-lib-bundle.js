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
        if (this.loggerKey) {
            options.headers["Studyalign-Logger-Key"] = this.loggerKey;
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
            if (options.method === "GET" || options.method === "DELETE") {
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
    basicDelete(path) {
        let options = {
            method: "DELETE",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        const yo = this.request(options);
        console.log(yo);
        return yo;
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
    deleteUser(userId) {
        return this.basicDelete("users/" + userId);
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
    deleteStudy(studyId) {
        return this.basicDelete("studies/" + studyId);
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
    getConditions(studyId) {
        return this.basicRead("studies/" + studyId + "/conditions");
    }
    createCondition(condition) {
        return this.basicCreate("conditions", condition);
    }
    updateCondition(conditionId, condition) {
        return this.basicUpdate("conditions/" + conditionId, condition);
    }
    deleteCondition(conditionId) {
        return this.basicDelete("conditions/" + conditionId);
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
    deleteTask(taskId) {
        return this.basicDelete("tasks/" + taskId);
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
    deleteText(textId) {
        return this.basicDelete("texts/" + textId);
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
    deleteQuestionnaire(questionnaireId) {
        return this.basicDelete("questionnaires/" + questionnaireId);
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
    deletePause(pauseId) {
        return this.basicDelete("pauses/" + pauseId);
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
    getStudySetupInfo(studyId) {
        return this.basicRead("studies/" + studyId + "/setup-info");
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
    setLoggerKey(loggerKey) {
        this.loggerKey = loggerKey;
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
            headers: {
                "Content-type": "application/json"
            }
        };
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
    const participantToken = url.searchParams.get("participant_token");
    return {
        studyId: studyId,
        conditionId: conditionId,
        loggerKey: loggerKey,
        participantToken: participantToken
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StudyAlignLib);

})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vc3JjL2ludGVyYWN0aW9ucy50cyIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9yZWdleC5qcyIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vbm9kZV9tb2R1bGVzL3V1aWQvZGlzdC9lc20tYnJvd3Nlci9ybmcuanMiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi8uL25vZGVfbW9kdWxlcy91dWlkL2Rpc3QvZXNtLWJyb3dzZXIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3Y0LmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvLi9ub2RlX21vZHVsZXMvdXVpZC9kaXN0L2VzbS1icm93c2VyL3ZhbGlkYXRlLmpzIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3R1ZHlBbGlnbkxpYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N0dWR5QWxpZ25MaWIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zdHVkeUFsaWduTGliLy4vc3JjL3N0dWR5LWFsaWduLWxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZrQztBQUVs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QUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUVuRSxPQUFPO1FBQ0gsT0FBTyxFQUFFLE9BQU87UUFDaEIsV0FBVyxFQUFFLFdBQVc7UUFDeEIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsZ0JBQWdCLEVBQUUsZ0JBQWdCO0tBQ3JDO0FBQ0wsQ0FBQztBQW91QkwsaUVBQWUsYUFBYSxFQUFDIiwiZmlsZSI6InN0dWR5LWFsaWduLWxpYi1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInN0dWR5QWxpZ25MaWJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wic3R1ZHlBbGlnbkxpYlwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJzdHVkeUFsaWduTGliXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IHt2NCBhcyB1dWlkdjR9IGZyb20gXCJ1dWlkXCI7XG5cbmNsYXNzIEludGVyYWN0aW9uQmFzZSB7XG4gICAgdXVpZDogc3RyaW5nO1xuICAgIGV2ZW50OiBzdHJpbmc7XG4gICAgdGltZTogbnVtYmVyO1xuICAgIG1ldGFEYXRhOiBvYmplY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIG1ldGFEYXRhOiBvYmplY3QpIHtcbiAgICAgICAgdGhpcy51dWlkID0gdXVpZHY0KCk7XG4gICAgICAgIHRoaXMuZXZlbnQgPSBldmVudFR5cGU7XG4gICAgICAgIHRoaXMudGltZSA9IHRpbWVzdGFtcDtcbiAgICAgICAgdGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1vdXNlSW50ZXJhY3Rpb24gZXh0ZW5kcyBJbnRlcmFjdGlvbkJhc2Uge1xuICAgIHNjcmVlblg6IG51bWJlcjtcbiAgICBzY3JlZW5ZOiBudW1iZXI7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBjdHJsS2V5OiBib29sZWFuO1xuICAgIHNoaWZ0S2V5OiBib29sZWFuO1xuICAgIGFsdEtleTogYm9vbGVhbjtcbiAgICBtZXRhS2V5OiBib29sZWFuO1xuICAgIGJ1dHRvbjogbnVtYmVyO1xuICAgIHJlbGF0ZWRUYXJnZXQ6IG9iamVjdDtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZXZlbnRUeXBlOiBzdHJpbmcsIHRpbWVzdGFtcDogbnVtYmVyLCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCByZWxhdGVkVGFyZ2V0ID0ge30sIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5zY3JlZW5YID0gbW91c2VFdmVudC5zY3JlZW5YO1xuICAgICAgICB0aGlzLnNjcmVlblkgPSBtb3VzZUV2ZW50LnNjcmVlblk7XG4gICAgICAgIHRoaXMuY2xpZW50WCA9IG1vdXNlRXZlbnQuY2xpZW50WDtcbiAgICAgICAgdGhpcy5jbGllbnRZID0gbW91c2VFdmVudC5jbGllbnRZO1xuICAgICAgICB0aGlzLmN0cmxLZXkgPSBtb3VzZUV2ZW50LmN0cmxLZXk7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSBtb3VzZUV2ZW50LnNoaWZ0S2V5O1xuICAgICAgICB0aGlzLmFsdEtleSA9IG1vdXNlRXZlbnQuYWx0S2V5O1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSBtb3VzZUV2ZW50Lm1ldGFLZXk7XG4gICAgICAgIHRoaXMuYnV0dG9uID0gbW91c2VFdmVudC5idXR0b247XG4gICAgICAgIHRoaXMucmVsYXRlZFRhcmdldCA9IHJlbGF0ZWRUYXJnZXQ7XG4gICAgICAgIHRoaXMueCA9IG1vdXNlRXZlbnQuc2NyZWVuWDtcbiAgICAgICAgdGhpcy55ID0gbW91c2VFdmVudC5zY3JlZW5ZO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERyYWdJbnRlcmFjdGlvbiBleHRlbmRzIE1vdXNlSW50ZXJhY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50VHlwZTogc3RyaW5nLCB0aW1lc3RhbXA6IG51bWJlciwgZHJhZ0V2ZW50OiBEcmFnRXZlbnQsIHJlbGF0ZWRUYXJnZXQgPSB7fSwgbWV0YURhdGEgPSB7fSkge1xuICAgICAgICBzdXBlcihldmVudFR5cGUsIHRpbWVzdGFtcCwgZHJhZ0V2ZW50LCByZWxhdGVkVGFyZ2V0LCBtZXRhRGF0YSk7XG4gICAgfVxufVxuXG5jbGFzcyBUb3VjaEJhc2Uge1xuICAgIHV1aWQ6IHN0cmluZztcbiAgICBhbHRpdHVkZUFuZ2xlOiBudW1iZXI7XG4gICAgYXppbXV0aEFuZ2xlOiBudW1iZXI7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBmb3JjZTogbnVtYmVyO1xuICAgIGlkZW50aWZpZXI6IG51bWJlcjtcbiAgICBzY3JlZW5YOiBudW1iZXI7XG4gICAgc2NyZWVuWTogbnVtYmVyO1xuICAgIHBhZ2VYOiBudW1iZXI7XG4gICAgcGFnZVk6IG51bWJlcjtcbiAgICByYWRpdXNYOiBudW1iZXI7XG4gICAgcmFkaXVzWTogbnVtYmVyO1xuICAgIHJvdGF0aW9uQW5nbGU6IG51bWJlcjtcbiAgICB0YXJnZXQ6IG9iamVjdDtcbiAgICB0b3VjaFR5cGU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHRvdWNoOiBUb3VjaCkge1xuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkdjQoKTtcbiAgICAgICAgdGhpcy5hbHRpdHVkZUFuZ2xlID0gdG91Y2guYWx0aXR1ZGVBbmdsZTtcbiAgICAgICAgdGhpcy5hemltdXRoQW5nbGUgPSB0b3VjaC5hemltdXRoQW5nbGU7XG4gICAgICAgIHRoaXMuY2xpZW50WCA9IHRvdWNoLmNsaWVudFg7XG4gICAgICAgIHRoaXMuY2xpZW50WSA9IHRvdWNoLmNsaWVudFk7XG4gICAgICAgIHRoaXMuZm9yY2UgPSB0b3VjaC5mb3JjZTtcbiAgICAgICAgdGhpcy5pZGVudGlmaWVyID0gdG91Y2guaWRlbnRpZmllcjtcbiAgICAgICAgdGhpcy5wYWdlWCA9IHRvdWNoLnBhZ2VYO1xuICAgICAgICB0aGlzLnBhZ2VZID0gdG91Y2gucGFnZVk7XG4gICAgICAgIHRoaXMucmFkaXVzWCA9IHRvdWNoLnJhZGl1c1g7XG4gICAgICAgIHRoaXMucmFkaXVzWSA9IHRvdWNoLnJhZGl1c1k7XG4gICAgICAgIHRoaXMucm90YXRpb25BbmdsZSA9IHRvdWNoLnJvdGF0aW9uQW5nbGU7XG4gICAgICAgIHRoaXMuc2NyZWVuWCA9IHRvdWNoLnNjcmVlblg7XG4gICAgICAgIHRoaXMuc2NyZWVuWSA9IHRvdWNoLnNjcmVlblk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdG91Y2gudGFyZ2V0O1xuICAgICAgICB0aGlzLnRvdWNoVHlwZSA9IHRvdWNoLnRvdWNoVHlwZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUb3VjaEludGVyYWN0aW9uIGV4dGVuZHMgSW50ZXJhY3Rpb25CYXNlIHtcbiAgICBhbHRLZXk6IGJvb2xlYW47XG4gICAgY3RybEtleTogYm9vbGVhbjtcbiAgICBtZXRhS2V5OiBib29sZWFuO1xuICAgIHNoaWZ0S2V5OiBib29sZWFuO1xuICAgIG1ldGFEYXRhOiBvYmplY3Q7XG5cbiAgICBjaGFuZ2VkVG91Y2hlczogVG91Y2hCYXNlW10gPSBbXTtcbiAgICB0YXJnZXRUb3VjaGVzOiBUb3VjaEJhc2VbXSA9IFtdO1xuICAgIHRvdWNoZXM6IFRvdWNoQmFzZVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIHRvdWNoRXZlbnQ6IFRvdWNoRXZlbnQsIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSB0b3VjaEV2ZW50LmFsdEtleTtcbiAgICAgICAgdGhpcy5jdHJsS2V5ID0gdG91Y2hFdmVudC5jdHJsS2V5O1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSB0b3VjaEV2ZW50Lm1ldGFLZXk7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSB0b3VjaEV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgIGlmICh0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzICYmIHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGk8dG91Y2hFdmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlZFRvdWNoZXMucHVzaChuZXcgVG91Y2hCYXNlKHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXNbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3VjaEV2ZW50LnRhcmdldFRvdWNoZXMgJiYgdG91Y2hFdmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPHRvdWNoRXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0VG91Y2hlcy5wdXNoKG5ldyBUb3VjaEJhc2UodG91Y2hFdmVudC50YXJnZXRUb3VjaGVzW2ldKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG91Y2hFdmVudC50b3VjaGVzICYmIHRvdWNoRXZlbnQudG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaTx0b3VjaEV2ZW50LnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdWNoZXMucHVzaChuZXcgVG91Y2hCYXNlKHRvdWNoRXZlbnQudG91Y2hlc1tpXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5Ym9hcmRJbnRlcmFjdGlvbiBleHRlbmRzIEludGVyYWN0aW9uQmFzZSB7XG4gICAgYWx0S2V5OiBib29sZWFuO1xuICAgIGNvZGU6IHN0cmluZztcbiAgICBpc0NvbXBvc2luZzogYm9vbGVhbjtcbiAgICBrZXk6IHN0cmluZztcbiAgICAvL2xvY2FsZTogc3RyaW5nO1xuICAgIGxvY2F0aW9uOiBudW1iZXI7XG4gICAgbWV0YUtleTogYm9vbGVhbjtcbiAgICByZXBlYXQ6IGJvb2xlYW47XG4gICAgc2hpZnRLZXk6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQsIG1ldGFEYXRhID0ge30pIHtcbiAgICAgICAgc3VwZXIoZXZlbnRUeXBlLCB0aW1lc3RhbXAsIG1ldGFEYXRhKTtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSBrZXlib2FyZEV2ZW50LmFsdEtleTtcbiAgICAgICAgdGhpcy5jb2RlID0ga2V5Ym9hcmRFdmVudC5jb2RlO1xuICAgICAgICB0aGlzLmlzQ29tcG9zaW5nID0ga2V5Ym9hcmRFdmVudC5pc0NvbXBvc2luZztcbiAgICAgICAgdGhpcy5rZXkgPSBrZXlib2FyZEV2ZW50LmtleTtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGtleWJvYXJkRXZlbnQubG9jYXRpb247XG4gICAgICAgIHRoaXMubWV0YUtleSA9IGtleWJvYXJkRXZlbnQubWV0YUtleTtcbiAgICAgICAgdGhpcy5yZXBlYXQgPSBrZXlib2FyZEV2ZW50LnJlcGVhdDtcbiAgICAgICAgdGhpcy5zaGlmdEtleSA9IGtleWJvYXJkRXZlbnQuc2hpZnRLZXk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR2VuZXJpY0ludGVyYWN0aW9uIGV4dGVuZHMgSW50ZXJhY3Rpb25CYXNlIHtcbiAgICBkYXRhOiBvYmplY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihldmVudFR5cGU6IHN0cmluZywgdGltZXN0YW1wOiBudW1iZXIsIGdlbmVyaWNFdmVudERhdGE6IG9iamVjdCwgbWV0YURhdGEgPSB7fSkge1xuICAgICAgICBzdXBlcihldmVudFR5cGUsIHRpbWVzdGFtcCwgbWV0YURhdGEpO1xuICAgICAgICB0aGlzLmRhdGEgPSBnZW5lcmljRXZlbnREYXRhO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCAvXig/OlswLTlhLWZdezh9LVswLTlhLWZdezR9LVsxLTVdWzAtOWEtZl17M30tWzg5YWJdWzAtOWEtZl17M30tWzAtOWEtZl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7IiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gSW4gdGhlIGJyb3dzZXIgd2UgdGhlcmVmb3JlXG4vLyByZXF1aXJlIHRoZSBjcnlwdG8gQVBJIGFuZCBkbyBub3Qgc3VwcG9ydCBidWlsdC1pbiBmYWxsYmFjayB0byBsb3dlciBxdWFsaXR5IHJhbmRvbSBudW1iZXJcbi8vIGdlbmVyYXRvcnMgKGxpa2UgTWF0aC5yYW5kb20oKSkuXG52YXIgZ2V0UmFuZG9tVmFsdWVzO1xudmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm5nKCkge1xuICAvLyBsYXp5IGxvYWQgc28gdGhhdCBlbnZpcm9ubWVudHMgdGhhdCBuZWVkIHRvIHBvbHlmaWxsIGhhdmUgYSBjaGFuY2UgdG8gZG8gc29cbiAgaWYgKCFnZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG8gaW1wbGVtZW50YXRpb24uIEFsc28sXG4gICAgLy8gZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIChtc0NyeXB0bykgb24gSUUxMS5cbiAgICBnZXRSYW5kb21WYWx1ZXMgPSB0eXBlb2YgY3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pIHx8IHR5cGVvZiBtc0NyeXB0byAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byk7XG5cbiAgICBpZiAoIWdldFJhbmRvbVZhbHVlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCkgbm90IHN1cHBvcnRlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91dWlkanMvdXVpZCNnZXRyYW5kb212YWx1ZXMtbm90LXN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xufSIsImltcG9ydCB2YWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlLmpzJztcbi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xuXG52YXIgYnl0ZVRvSGV4ID0gW107XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4LnB1c2goKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShhcnIpIHtcbiAgdmFyIG9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgLy8gTm90ZTogQmUgY2FyZWZ1bCBlZGl0aW5nIHRoaXMgY29kZSEgIEl0J3MgYmVlbiB0dW5lZCBmb3IgcGVyZm9ybWFuY2VcbiAgLy8gYW5kIHdvcmtzIGluIHdheXMgeW91IG1heSBub3QgZXhwZWN0LiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3V1aWRqcy91dWlkL3B1bGwvNDM0XG4gIHZhciB1dWlkID0gKGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxXV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDJdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgM11dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA0XV0gKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDVdXSArICctJyArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgNl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyA3XV0gKyAnLScgKyBieXRlVG9IZXhbYXJyW29mZnNldCArIDhdXSArIGJ5dGVUb0hleFthcnJbb2Zmc2V0ICsgOV1dICsgJy0nICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMV1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxMl1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxM11dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNF1dICsgYnl0ZVRvSGV4W2FycltvZmZzZXQgKyAxNV1dKS50b0xvd2VyQ2FzZSgpOyAvLyBDb25zaXN0ZW5jeSBjaGVjayBmb3IgdmFsaWQgVVVJRC4gIElmIHRoaXMgdGhyb3dzLCBpdCdzIGxpa2VseSBkdWUgdG8gb25lXG4gIC8vIG9mIHRoZSBmb2xsb3dpbmc6XG4gIC8vIC0gT25lIG9yIG1vcmUgaW5wdXQgYXJyYXkgdmFsdWVzIGRvbid0IG1hcCB0byBhIGhleCBvY3RldCAobGVhZGluZyB0b1xuICAvLyBcInVuZGVmaW5lZFwiIGluIHRoZSB1dWlkKVxuICAvLyAtIEludmFsaWQgaW5wdXQgdmFsdWVzIGZvciB0aGUgUkZDIGB2ZXJzaW9uYCBvciBgdmFyaWFudGAgZmllbGRzXG5cbiAgaWYgKCF2YWxpZGF0ZSh1dWlkKSkge1xuICAgIHRocm93IFR5cGVFcnJvcignU3RyaW5naWZpZWQgVVVJRCBpcyBpbnZhbGlkJyk7XG4gIH1cblxuICByZXR1cm4gdXVpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RyaW5naWZ5OyIsImltcG9ydCBybmcgZnJvbSAnLi9ybmcuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7IC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblxuICBybmRzWzZdID0gcm5kc1s2XSAmIDB4MGYgfCAweDQwO1xuICBybmRzWzhdID0gcm5kc1s4XSAmIDB4M2YgfCAweDgwOyAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcblxuICBpZiAoYnVmKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHJuZHNbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZjtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnkocm5kcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHY0OyIsImltcG9ydCBSRUdFWCBmcm9tICcuL3JlZ2V4LmpzJztcblxuZnVuY3Rpb24gdmFsaWRhdGUodXVpZCkge1xuICByZXR1cm4gdHlwZW9mIHV1aWQgPT09ICdzdHJpbmcnICYmIFJFR0VYLnRlc3QodXVpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRlOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7XG4gICAgRHJhZ0ludGVyYWN0aW9uLFxuICAgIEdlbmVyaWNJbnRlcmFjdGlvbixcbiAgICBLZXlib2FyZEludGVyYWN0aW9uLFxuICAgIE1vdXNlSW50ZXJhY3Rpb24sXG4gICAgVG91Y2hJbnRlcmFjdGlvblxufSBmcm9tIFwiLi9pbnRlcmFjdGlvbnNcIjtcblxuY2xhc3MgU3R1ZHlBbGlnbkxpYiB7XG5cbiAgICBhcGlWZXJzaW9uOiBzdHJpbmc7XG4gICAgdXJsOiBzdHJpbmc7XG4gICAgc3R1ZHlJZDogbnVtYmVyO1xuICAgIGFwaVVybDogc3RyaW5nO1xuICAgIGxvZ2dlcktleTogc3RyaW5nO1xuICAgIHNzZTogRXZlbnRTb3VyY2U7XG5cbiAgICAvLyBJbnRlcmFjdGlvbiBMaXN0cyAoV2ViIEV2ZW50cyBvbmx5KSwgbmVlZGVkIGZvciBidWxrIHNhdmluZ1xuICAgIG1vdXNlSW50ZXJhY3Rpb25MaXN0OiBNb3VzZUludGVyYWN0aW9uW10gPSBbXTtcbiAgICBkcmFnSW50ZXJhY3Rpb25MaXN0OiBEcmFnSW50ZXJhY3Rpb25bXSA9IFtdO1xuICAgIGtleWJvYXJkSW50ZXJhY3Rpb25MaXN0OiBLZXlib2FyZEludGVyYWN0aW9uW10gPSBbXTtcbiAgICB0b3VjaEludGVyYWN0aW9uTGlzdDogVG91Y2hJbnRlcmFjdGlvbltdID0gW107XG4gICAgZ2VuZXJpY0ludGVyYWN0aW9uTGlzdDogR2VuZXJpY0ludGVyYWN0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwXCIsIHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmFwaVZlcnNpb24gPSBcInYxXCI7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLnN0dWR5SWQgPSBzdHVkeUlkO1xuICAgICAgICB0aGlzLmFwaVVybCA9IHRoaXMudXJsICsgXCIvYXBpL1wiICsgdGhpcy5hcGlWZXJzaW9uO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQYXJhbXNGcm9tVVJMID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgY29uc3Qgc3R1ZHlJZCA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwic3R1ZHlfaWRcIik7XG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbklkID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJjb25kaXRpb25faWRcIikgfHwgMTsgLy8gdmFsdWUgZnJvbSBnZXQgcGFyYW1ldGVyIG9yIDEgKGRlZmF1bHQpXG4gICAgICAgIGNvbnN0IGxvZ2dlcktleSA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwibG9nZ2VyX2tleVwiKTsgLy8gbmVlZGVkIGZvciBsb2dnaW5nXG4gICAgICAgIGNvbnN0IHBhcnRpY2lwYW50VG9rZW4gPSB1cmwuc2VhcmNoUGFyYW1zLmdldChcInBhcnRpY2lwYW50X3Rva2VuXCIpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdHVkeUlkOiBzdHVkeUlkLFxuICAgICAgICAgICAgY29uZGl0aW9uSWQ6IGNvbmRpdGlvbklkLFxuICAgICAgICAgICAgbG9nZ2VyS2V5OiBsb2dnZXJLZXksXG4gICAgICAgICAgICBwYXJ0aWNpcGFudFRva2VuOiBwYXJ0aWNpcGFudFRva2VuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRUaW1lc3RhbXAoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdztcbiAgICB9XG5cbiAgICBnZXRUaW1lc3RhbXBXaXRoT2Zmc2V0KCkge1xuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgKC0xICogZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpKSlcbiAgICAgICAgcmV0dXJuIGRhdGUuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIHNldEhlYWRlcnMob3B0aW9uczogT3B0aW9ucywgcmVmcmVzaDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc190b2tlbiA9ICFyZWZyZXNoID8gdGhpcy5yZWFkVG9rZW5zKFwiYWNjZXNzX3Rva2VuXCIpIDogdGhpcy5yZWFkVG9rZW5zKFwicmVmcmVzaF90b2tlblwiKTtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzW1wiQXV0aG9yaXphdGlvblwiXSA9IFwiQmVhcmVyIFwiICsgYWNjZXNzX3Rva2VuO1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJDb250ZW50LXR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbiAgICB9XG5cbiAgICBzZXRMb2dnZXJIZWFkZXJzKG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMubG9nZ2VyS2V5KSB7XG4gICAgICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJTdHVkeWFsaWduLUxvZ2dlci1LZXlcIl0gPSB0aGlzLmxvZ2dlcktleTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJDb250ZW50LXR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbiAgICB9XG5cbiAgICByZXF1ZXN0KG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZW5jb2RlUGFyYW1zID0gKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhkYXRhKS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2tleV0pO1xuICAgICAgICAgICAgfSkuam9pbignJicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMuYXBpVXJsICsgXCIvXCIgKyBvcHRpb25zLnBhdGg7XG4gICAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm9ubG9hZCkge1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSBvcHRpb25zLm9ubG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiB4aHIucmVzcG9uc2UgPyBKU09OLnBhcnNlKHhoci5yZXNwb25zZSkgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNUZXh0OiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Qm9keTogb3B0aW9ucy5ib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vbnByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBvcHRpb25zLm9ucHJvZ3Jlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vbmVycm9yKSB7XG4gICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBvcHRpb25zLm9uZXJyb3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Qm9keTogb3B0aW9ucy5ib2R5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmhlYWRlcnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIG9wdGlvbnMuaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8IG9wdGlvbnMubWV0aG9kID09PSBcIkRFTEVURVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IG9wdGlvbnMucGFyYW1zO1xuICAgICAgICAgICAgICAgIGxldCBlbmNvZGVkUGFyYW1zID0gXCJcIjtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zICYmIHR5cGVvZiBwYXJhbXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuY29kZWRQYXJhbXMgPSBlbmNvZGVQYXJhbXMocGFyYW1zKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB4aHIuc2VuZChlbmNvZGVkUGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gXCJQT1NUXCIgfHwgb3B0aW9ucy5tZXRob2QgPT09IFwiUEFUQ0hcIikge1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKG9wdGlvbnMuZm9ybURhdGEgPyBlbmNvZGVQYXJhbXMob3B0aW9ucy5ib2R5KSA6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuYm9keSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiYXNpY0NyZWF0ZShwYXRoOiBzdHJpbmcsIGRhdGE6IG9iamVjdCkge1xuICAgICAgICBsZXQgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMuYm9keSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYmFzaWNSZWFkKHBhdGg6IHN0cmluZykge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGJhc2ljVXBkYXRlKHBhdGg6IHN0cmluZywgZGF0YTogb2JqZWN0KSB7XG4gICAgICAgIGxldCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMuYm9keSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYmFzaWNEZWxldGUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB5byA9IHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICAgICAgY29uc29sZS5sb2coeW8pXG4gICAgICAgIHJldHVybiB5b1xuICAgIH1cblxuICAgIC8vIEFkbWluIHJlbGF0ZWQgZnVuY3Rpb25zXG4gICAgdXNlckxvZ2luKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInVzZXJzL2xvZ2luXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGJvZHk6IHt1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOiBwYXNzd29yZH0sXG4gICAgICAgICAgICBmb3JtRGF0YTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbXCJDb250ZW50LXR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHVzZXJNZSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJ1c2Vycy9tZVwiKTtcbiAgICB9XG5cbiAgICB1c2VyUmVmcmVzaFRva2VuKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJ1c2Vycy9yZWZyZXNoXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyhvcHRpb25zLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRVc2VycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwidXNlcnNcIik7XG4gICAgfVxuXG4gICAgZ2V0VXNlcih1c2VySWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJ1c2Vycy9cIiArIHVzZXJJZCk7XG4gICAgfVxuXG4gICAgY3JlYXRlVXNlcih1c2VyOiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNDcmVhdGUoXCJ1c2Vyc1wiLCB1c2VyKVxuICAgIH1cblxuICAgIHVwZGF0ZVVzZXIodXNlcklkOiBudW1iZXIsIHVzZXI6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInVzZXJzL1wiICsgdXNlcklkLCB1c2VyKTtcbiAgICB9XG5cbiAgICBkZWxldGVVc2VyKHVzZXJJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljRGVsZXRlKFwidXNlcnMvXCIgKyB1c2VySWQpO1xuICAgIH1cblxuICAgIC8vIC0tLS0gTUFJTkxZIEZPUiBVU0UgSU4gQURNSU4gRlJPTlRFTkQgLS0tLSAvL1xuXG4gICAgLy8gU3R1ZGllc1xuXG4gICAgZ2V0U3R1ZGllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllc1wiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTdHVkeShzdHVkeTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljQ3JlYXRlKFwic3R1ZGllc1wiLCBzdHVkeSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU3R1ZHkoc3R1ZHlJZDogbnVtYmVyLCBzdHVkeTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwic3R1ZGllcy9cIiArIHN0dWR5SWQsIHN0dWR5KTtcbiAgICB9XG5cbiAgICBkZWxldGVTdHVkeShzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNEZWxldGUoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVQcm9jZWR1cmVXaXRoU3RlcHMoc3R1ZHlJZDogbnVtYmVyLCBwcm9jZWR1cmVTY2hlbWU6IG9iamVjdCkge1xuICAgICAgICB0aGlzLmJhc2ljQ3JlYXRlKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi9wcm9jZWR1cmVzXCIsIHByb2NlZHVyZVNjaGVtZSk7XG4gICAgfVxuXG4gICAgZ2V0UGFydGljaXBhbnRzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3BhcnRpY2lwYW50c1wiKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVBhcnRpY2lwYW50cyhzdHVkeUlkOiBudW1iZXIsIGFtb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3BhcnRpY2lwYW50c1wiLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBib2R5OiB7YW1vdW50OiBhbW91bnR9LFxuICAgICAgICAgICAgZm9ybURhdGE6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHBvcHVsYXRlU3VydmV5UGFydGljaXBhbnRzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3N1cnZleS1wYXJ0aWNpcGFudHNcIik7XG4gICAgfVxuXG4gICAgLy8gQ29uZGl0aW9uc1xuXG4gICAgZ2V0Q29uZGl0aW9uSWRzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJjb25kaXRpb25zL2lkc1wiLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBib2R5OiB7c3R1ZHlfaWQ6IHN0dWR5SWR9LFxuICAgICAgICAgICAgZm9ybURhdGE6IHRydWUsXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldENvbmRpdGlvbihjb25kaXRpb25JZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcImNvbmRpdGlvbnMvXCIgKyBjb25kaXRpb25JZCk7XG4gICAgfVxuXG4gICAgZ2V0Q29uZGl0aW9ucyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi9jb25kaXRpb25zXCIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbmRpdGlvbihjb25kaXRpb246IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcImNvbmRpdGlvbnNcIiwgY29uZGl0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGVDb25kaXRpb24oY29uZGl0aW9uSWQ6IG51bWJlciwgY29uZGl0aW9uOiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNVcGRhdGUoXCJjb25kaXRpb25zL1wiICsgY29uZGl0aW9uSWQsIGNvbmRpdGlvbik7XG4gICAgfVxuXG4gICAgZGVsZXRlQ29uZGl0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNEZWxldGUoXCJjb25kaXRpb25zL1wiICsgY29uZGl0aW9uSWQpO1xuICAgIH1cblxuICAgIGdldFRhc2tzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3Rhc2tzXCIpO1xuICAgIH1cblxuICAgIGdldFRleHRzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3RleHRzXCIpO1xuICAgIH1cblxuICAgIGdldFF1ZXN0aW9ubmFpcmVzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJzdHVkaWVzL1wiICsgc3R1ZHlJZCArIFwiL3F1ZXN0aW9ubmFpcmVzXCIpO1xuICAgIH1cblxuICAgIGdldFBhdXNlcyhzdHVkeUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwic3R1ZGllcy9cIiArIHN0dWR5SWQgKyBcIi9wYXVzZXNcIik7XG4gICAgfVxuXG5cbiAgICAvLyBQcm9jZWR1cmVzXG5cbiAgICBnZXRQcm9jZWR1cmVzKHN0dWR5SWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgIGJvZHk6IHtzdHVkeV9pZDogc3R1ZHlJZH0sXG4gICAgICAgICAgICBmb3JtRGF0YTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gUGFydGljaXBhbnRzXG5cbiAgICBnZXRQYXJ0aWNpcGFudHNCeVByb2NlZHVyZShwcm9jZWR1cmVJZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInBhcnRpY2lwYW50c1wiLFxuICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICBib2R5OiB7cHJvY2VkdXJlX2lkOiBwcm9jZWR1cmVJZH0sXG4gICAgICAgICAgICBmb3JtRGF0YTogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0UGFydGljaXBhbnRCeUlkKHBhcnRpY2lwYW50SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJwYXJ0aWNpcGFudHMvXCIgKyBwYXJ0aWNpcGFudElkKTtcbiAgICB9XG5cbiAgICBlbmRQYXJ0aWNpcGFudFBhdXNlKHBhcnRpY2lwYW50VG9rZW46IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJwYXJ0aWNpcGFudHMvXCIgKyBwYXJ0aWNpcGFudFRva2VuICsgXCIvZW5kLXBhdXNlXCIpO1xuICAgIH1cblxuICAgIC8vVGFza3NcblxuICAgIGNyZWF0ZVRhc2sodGFzazogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljQ3JlYXRlKFwidGFza3NcIiwgdGFzayk7XG4gICAgfVxuXG4gICAgZ2V0VGFzayh0YXNrSWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1JlYWQoXCJ0YXNrcy9cIiArIHRhc2tJZCk7XG4gICAgfVxuXG4gICAgdXBkYXRlVGFzayh0YXNrSWQ6IG51bWJlciwgdGFzazogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwidGFza3MvXCIgKyB0YXNrSWQsIHRhc2spO1xuICAgIH1cblxuICAgIGRlbGV0ZVRhc2sodGFza0lkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNEZWxldGUoXCJ0YXNrcy9cIiArIHRhc2tJZCk7XG4gICAgfVxuXG4gICAgLy9UZXh0c1xuXG4gICAgY3JlYXRlVGV4dCh0ZXh0OiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNDcmVhdGUoXCJ0ZXh0c1wiLCB0ZXh0KTtcbiAgICB9XG5cbiAgICBnZXRUZXh0KHRleHRJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInRleHRzL1wiICsgdGV4dElkKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUZXh0KHRleHRJZDogbnVtYmVyLCB0ZXh0OiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNVcGRhdGUoXCJ0ZXh0cy9cIiArIHRleHRJZCwgdGV4dCk7XG4gICAgfVxuXG4gICAgZGVsZXRlVGV4dCh0ZXh0SWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0RlbGV0ZShcInRleHRzL1wiICsgdGV4dElkKTtcbiAgICB9XG5cbiAgICAvL1F1ZXN0aW9ubmFpcmVzXG5cbiAgICBjcmVhdGVRdWVzdGlvbm5haXJlKHF1ZXN0aW9ubmFpcmU6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0NyZWF0ZShcInF1ZXN0aW9ubmFpcmVzXCIsIHF1ZXN0aW9ubmFpcmUpO1xuICAgIH1cblxuICAgIGdldFF1ZXN0aW9ubmFpcmUocXVlc3Rpb25uYWlyZUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwicXVlc3Rpb25uYWlyZXMvXCIgKyBxdWVzdGlvbm5haXJlSWQpO1xuICAgIH1cblxuICAgIHVwZGF0ZVF1ZXN0aW9ubmFpcmUocXVlc3Rpb25uYWlyZUlkOiBudW1iZXIsIHF1ZXN0aW9ubmFpcmU6IG9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY1VwZGF0ZShcInF1ZXN0aW9ubmFpcmVzL1wiICsgcXVlc3Rpb25uYWlyZUlkLCBxdWVzdGlvbm5haXJlKTtcbiAgICB9XG5cbiAgICBkZWxldGVRdWVzdGlvbm5haXJlKHF1ZXN0aW9ubmFpcmVJZDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljRGVsZXRlKFwicXVlc3Rpb25uYWlyZXMvXCIgKyBxdWVzdGlvbm5haXJlSWQpO1xuICAgIH1cblxuICAgIC8vUGF1c2VzXG5cbiAgICBjcmVhdGVQYXVzZShwYXVzZTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljQ3JlYXRlKFwicGF1c2VzXCIsIHBhdXNlKTtcbiAgICB9XG5cbiAgICBnZXRQYXVzZShwYXVzZUlkOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzaWNSZWFkKFwicGF1c2VzL1wiICsgcGF1c2VJZCk7XG4gICAgfVxuXG4gICAgdXBkYXRlUGF1c2UocGF1c2VJZDogbnVtYmVyLCBwYXVzZTogb2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljVXBkYXRlKFwicGF1c2VzL1wiICsgcGF1c2VJZCwgcGF1c2UpO1xuICAgIH1cblxuICAgIGRlbGV0ZVBhdXNlKHBhdXNlSWQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpY0RlbGV0ZShcInBhdXNlcy9cIiArIHBhdXNlSWQpO1xuICAgIH1cblxuICAgIC8vIC0tLS0gTUFJTkxZIEZPUiBVU0UgSU4gU1RVRFkgRlJPTlRFTkQgLS0tLSAvL1xuXG4gICAgLy9UT0RPOiByZWFkIGNvbmRpdGlvbiBjb25maWdcblxuICAgIC8vU3R1ZHkgRnJvbnRlbmQgcmVsYXRlZCBmdW5jdGlvbnNcblxuICAgIGdldFN0dWR5KHN0dWR5SWQ/OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwic3R1ZGllcy9cIiArIChzdHVkeUlkIHx8IHRoaXMuc3R1ZHlJZCksXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRTdHVkeVNldHVwSW5mbyhzdHVkeUlkPzogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2ljUmVhZChcInN0dWRpZXMvXCIgKyBzdHVkeUlkICsgXCIvc2V0dXAtaW5mb1wiKVxuICAgIH1cblxuICAgIC8vIFBhcnRpY2lwYXRpb24gcmVsYXRlZCBtZXRob2RzXG5cbiAgICBnZXRQYXJ0aWNpcGFudChwYXJ0aWNpcGFudFRva2VuOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwicGFydGljaXBhbnRzL3Rva2VuL1wiICsgcGFydGljaXBhbnRUb2tlbixcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHBhcnRpY2lwYXRlKHBhcnRpY2lwYW50VG9rZW4/OiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInN0dWRpZXMvXCIgKyB0aGlzLnN0dWR5SWQgKyBcIi9wYXJ0aWNpcGF0ZVwiXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRpY2lwYW50VG9rZW4pIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHBhdGg6IFwic3R1ZGllcy9cIiArIHRoaXMuc3R1ZHlJZCArIFwiL3BhcnRpY2lwYXRlL1wiICsgcGFydGljaXBhbnRUb2tlblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2V0TG9nZ2VyS2V5KGxvZ2dlcktleSkge1xuICAgICAgICB0aGlzLmxvZ2dlcktleSA9IGxvZ2dlcktleTtcbiAgICB9XG5cbiAgICBzdG9yZVRva2VucyhyZXNwb25zZUpzb24pIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0b2tlbnNcIiwgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VKc29uKSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQWNjZXNzVG9rZW4ocmVzcG9uc2VKc29uKSB7XG4gICAgICAgIGNvbnN0IHRva2VucyA9IHRoaXMucmVhZFRva2VucygpO1xuICAgICAgICB0b2tlbnNbXCJhY2Nlc3NfdG9rZW5cIl0gPSByZXNwb25zZUpzb25bXCJhY2Nlc3NfdG9rZW5cIl07XG4gICAgICAgIHRoaXMuc3RvcmVUb2tlbnModG9rZW5zKTtcbiAgICB9XG5cbiAgICByZWFkVG9rZW5zKGtleT0gbnVsbCkge1xuICAgICAgICBsZXQgdG9rZW5zID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlbnNcIik7XG4gICAgICAgIGlmICh0b2tlbnMpIHtcbiAgICAgICAgICAgIHRva2VucyA9IEpTT04ucGFyc2UodG9rZW5zKTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW5zW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRlbGV0ZVRva2VucygpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ0b2tlbnNcIik7XG4gICAgfVxuXG4gICAgcmVmcmVzaFRva2VuKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwYXJ0aWNpcGFudHMvcmVmcmVzaFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgbWUoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwicGFydGljaXBhbnRzL21lXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRQcm9jZWR1cmUocHJvY2VkdXJlSWQ6IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZXMvXCIgKyBwcm9jZWR1cmVJZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGNyZWF0ZSBidWxrcyBmcm9tIGludGVyYWN0aW9uIGxpc3RzXG4gICAgcHJpdmF0ZSBidWlsZEJ1bGtMaXN0KGludGVyYWN0aW9uTGlzdDogSW50ZXJhY3Rpb25UeXBlcywgYnVsa1NpemU6IG51bWJlciA9IDEwKSB7XG4gICAgICAgIGNvbnN0IGJ1bGtzID0gW107XG4gICAgICAgIHdoaWxlICh0aGlzW2ludGVyYWN0aW9uTGlzdF0ubGVuZ3RoID4gYnVsa1NpemUpIHtcbiAgICAgICAgICAgIGJ1bGtzLnB1c2godGhpc1tpbnRlcmFjdGlvbkxpc3RdLnNwbGljZSgwLCBidWxrU2l6ZSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzW2ludGVyYWN0aW9uTGlzdF0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYnVsa3MucHVzaCh0aGlzW2ludGVyYWN0aW9uTGlzdF0uc3BsaWNlKDAsIHRoaXNbaW50ZXJhY3Rpb25MaXN0XS5sZW5ndGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnVsa3M7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogdHlwZSBjYWxsYmFjayBjb3JyZWN0bHksIHN0YXJ0aW5nIHBvaW50IGNvdWxkIGJlIChjb25kaXRpb25JZDogbnVtYmVyLCBpbnRlcmFjdGlvbnM6IG9iamVjdFtdKSA9PiBQcm9taXNlPGFueT5cbiAgICBsb2dJbnRlcmFjdGlvbkJ1bGsocGF0aDogc3RyaW5nLCBjb25kaXRpb25JZDogbnVtYmVyLCBpbnRlcmFjdGlvbkxpc3Q6IEludGVyYWN0aW9uVHlwZXMsIGJ1bGtTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0KSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uQnVsa3MgPSB0aGlzLmJ1aWxkQnVsa0xpc3QoaW50ZXJhY3Rpb25MaXN0LCBidWxrU2l6ZSk7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uQnVsa1JlcXVlc3RzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25CdWxrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW50ZXJhY3Rpb25CdWxrUmVxdWVzdHMucHVzaChsb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0KHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvbkJ1bGtzW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZChpbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0KHBhdGg6IHN0cmluZywgY29uZGl0aW9uSWQ6IG51bWJlciwgaW50ZXJhY3Rpb25zOiBvYmplY3RbXSkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TG9nZ2VySGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucy5ib2R5ID0ge1xuICAgICAgICAgICAgY29uZGl0aW9uX2lkOiBjb25kaXRpb25JZCxcbiAgICAgICAgICAgIGludGVyYWN0aW9uczogaW50ZXJhY3Rpb25zXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2dJbnRlcmFjdGlvblJlcXVlc3QocGF0aDogc3RyaW5nLCBjb25kaXRpb25JZDogbnVtYmVyLCBpbnRlcmFjdGlvbjogb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRMb2dnZXJIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLmJvZHkgPSB7XG4gICAgICAgICAgICBjb25kaXRpb25faWQ6IGNvbmRpdGlvbklkLFxuICAgICAgICAgICAgaW50ZXJhY3Rpb246IGludGVyYWN0aW9uXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gTW91c2UgSW50ZXJhY3Rpb25cblxuICAgIGxvZ01vdXNlSW50ZXJhY3Rpb24oY29uZGl0aW9uSWQ6IG51bWJlciwgZXZlbnRUeXBlOiBzdHJpbmcsIG1vdXNlRXZlbnQ6IE1vdXNlRXZlbnQsIHRpbWVzdGFtcDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFRhcmdldDoge30gPSB7fSwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgTW91c2VJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgbW91c2VFdmVudCwgcmVsYXRlZFRhcmdldCwgbWV0YURhdGEpO1xuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi9tb3VzZVwiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvblJlcXVlc3QocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uKTtcbiAgICB9XG5cbiAgICBhZGRNb3VzZUludGVyYWN0aW9uKGV2ZW50VHlwZTogc3RyaW5nLCBtb3VzZUV2ZW50OiBNb3VzZUV2ZW50LCB0aW1lc3RhbXA6IG51bWJlciwgcmVsYXRlZFRhcmdldDoge30gPSB7fSwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgdGhpcy5tb3VzZUludGVyYWN0aW9uTGlzdC5wdXNoKG5ldyBNb3VzZUludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCBtb3VzZUV2ZW50LCByZWxhdGVkVGFyZ2V0LCBtZXRhRGF0YSkpO1xuICAgIH1cblxuICAgIGxvZ01vdXNlSW50ZXJhY3Rpb25CdWxrKGNvbmRpdGlvbklkOiBudW1iZXIsIGJ1bGtTaXplOiBudW1iZXIgPSAxMCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uVHlwZSA9IFwibW91c2VJbnRlcmFjdGlvbkxpc3RcIlxuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi9tb3VzZS9idWxrXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsayhwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb25UeXBlLCBidWxrU2l6ZSwgdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIERyYWcgSW50ZXJhY3Rpb25cblxuICAgIGxvZ0RyYWdJbnRlcmFjdGlvbihjb25kaXRpb25JZDogbnVtYmVyLCBldmVudFR5cGU6IHN0cmluZywgZHJhZ0V2ZW50OiBEcmFnRXZlbnQsIHRpbWVzdGFtcDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZFRhcmdldDoge30gPSB7fSwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgRHJhZ0ludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCBkcmFnRXZlbnQsIHJlbGF0ZWRUYXJnZXQsIG1ldGFEYXRhKTtcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vZHJhZ1wiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvblJlcXVlc3QocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uKTtcbiAgICB9XG5cbiAgICBhZGREcmFnSW50ZXJhY3Rpb24oZXZlbnRUeXBlOiBzdHJpbmcsIGRyYWdFdmVudDogRHJhZ0V2ZW50LCB0aW1lc3RhbXA6IG51bWJlciwgcmVsYXRlZFRhcmdldDoge30gPSB7fSwgbWV0YURhdGE6IHt9ID0ge30pIHtcbiAgICAgICAgdGhpcy5kcmFnSW50ZXJhY3Rpb25MaXN0LnB1c2gobmV3IERyYWdJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwgZHJhZ0V2ZW50LCByZWxhdGVkVGFyZ2V0LCBtZXRhRGF0YSkpO1xuICAgIH1cblxuICAgIGxvZ0RyYWdJbnRlcmFjdGlvbkJ1bGsoY29uZGl0aW9uSWQ6IG51bWJlciwgYnVsa1NpemU6IG51bWJlciA9IDEwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25UeXBlID0gXCJkcmFnSW50ZXJhY3Rpb25MaXN0XCJcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24vZHJhZy9idWxrXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsayhwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb25UeXBlLCBidWxrU2l6ZSwgdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGtSZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIEtleWJvYXJkIEludGVyYWN0aW9uXG5cbiAgICBsb2dLZXlib2FyZEludGVyYWN0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIsIGV2ZW50VHlwZTogc3RyaW5nLCBrZXlib2FyZEV2ZW50OiBLZXlib2FyZEV2ZW50LCB0aW1lc3RhbXA6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IEtleWJvYXJkSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIGtleWJvYXJkRXZlbnQsIG1ldGFEYXRhKTtcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24va2V5Ym9hcmRcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25SZXF1ZXN0KHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvbik7XG4gICAgfVxuXG4gICAgYWRkS2V5Ym9hcmRJbnRlcmFjdGlvbihldmVudFR5cGU6IHN0cmluZywga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCwgdGltZXN0YW1wOiBudW1iZXIsIG1ldGFEYXRhOiB7fSA9IHt9KSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRJbnRlcmFjdGlvbkxpc3QucHVzaChuZXcgS2V5Ym9hcmRJbnRlcmFjdGlvbihldmVudFR5cGUsIHRpbWVzdGFtcCwga2V5Ym9hcmRFdmVudCwgbWV0YURhdGEpKTtcbiAgICB9XG5cbiAgICBsb2dLZXlib2FyZEludGVyYWN0aW9uQnVsayhjb25kaXRpb25JZDogbnVtYmVyLCBidWxrU2l6ZTogbnVtYmVyID0gMTApOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvblR5cGUgPSBcImtleWJvYXJkSW50ZXJhY3Rpb25MaXN0XCJcbiAgICAgICAgY29uc3QgcGF0aCA9IFwiaW50ZXJhY3Rpb24va2V5Ym9hcmQvYnVsa1wiO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2dJbnRlcmFjdGlvbkJ1bGsocGF0aCwgY29uZGl0aW9uSWQsIGludGVyYWN0aW9uVHlwZSwgYnVsa1NpemUsIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBUb3VjaCBJbnRlcmFjdGlvblxuXG4gICAgbG9nVG91Y2hJbnRlcmFjdGlvbihjb25kaXRpb25JZDogbnVtYmVyLCBldmVudFR5cGU6IHN0cmluZywgdG91Y2hFdmVudDogVG91Y2hFdmVudCwgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBUb3VjaEludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCB0b3VjaEV2ZW50LCBtZXRhRGF0YSk7XG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL3RvdWNoXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uUmVxdWVzdChwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb24pO1xuICAgIH1cblxuICAgIGFkZFRvdWNoSW50ZXJhY3Rpb24oZXZlbnRUeXBlOiBzdHJpbmcsIHRvdWNoRXZlbnQ6IFRvdWNoRXZlbnQsIHRpbWVzdGFtcDogbnVtYmVyLCBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICB0aGlzLnRvdWNoSW50ZXJhY3Rpb25MaXN0LnB1c2gobmV3IFRvdWNoSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIHRvdWNoRXZlbnQsIG1ldGFEYXRhKSk7XG4gICAgfVxuXG4gICAgbG9nVG91Y2hJbnRlcmFjdGlvbkJ1bGsoY29uZGl0aW9uSWQ6IG51bWJlciwgYnVsa1NpemU6IG51bWJlciA9IDEwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25UeXBlID0gXCJ0b3VjaEludGVyYWN0aW9uTGlzdFwiXG4gICAgICAgIGNvbnN0IHBhdGggPSBcImludGVyYWN0aW9uL3RvdWNoL2J1bGtcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrKHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvblR5cGUsIGJ1bGtTaXplLCB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsa1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJpYyBJbnRlcmFjdGlvblxuXG4gICAgbG9nR2VuZXJpY0ludGVyYWN0aW9uKGNvbmRpdGlvbklkOiBudW1iZXIsIGV2ZW50VHlwZTogc3RyaW5nLCBnZW5lcmljRXZlbnQ6IG9iamVjdCwgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBHZW5lcmljSW50ZXJhY3Rpb24oZXZlbnRUeXBlLCB0aW1lc3RhbXAsIGdlbmVyaWNFdmVudCwgbWV0YURhdGEpO1xuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi9nZW5lcmljXCI7XG4gICAgICAgIHJldHVybiB0aGlzLmxvZ0ludGVyYWN0aW9uUmVxdWVzdChwYXRoLCBjb25kaXRpb25JZCwgaW50ZXJhY3Rpb24pO1xuICAgIH1cblxuICAgIGFkZEdlbmVyaWNJbnRlcmFjdGlvbihldmVudFR5cGU6IHN0cmluZywgZ2VuZXJpY0V2ZW50OiBvYmplY3QsIHRpbWVzdGFtcDogbnVtYmVyLCBtZXRhRGF0YToge30gPSB7fSkge1xuICAgICAgICB0aGlzLmdlbmVyaWNJbnRlcmFjdGlvbkxpc3QucHVzaChuZXcgR2VuZXJpY0ludGVyYWN0aW9uKGV2ZW50VHlwZSwgdGltZXN0YW1wLCBnZW5lcmljRXZlbnQsIG1ldGFEYXRhKSk7XG4gICAgfVxuXG4gICAgbG9nR2VuZXJpY0ludGVyYWN0aW9uQnVsayhjb25kaXRpb25JZDogbnVtYmVyLCBidWxrU2l6ZTogbnVtYmVyID0gMTApOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvblR5cGUgPSBcImdlbmVyaWNJbnRlcmFjdGlvbkxpc3RcIlxuICAgICAgICBjb25zdCBwYXRoID0gXCJpbnRlcmFjdGlvbi9nZW5lcmljL2J1bGtcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9nSW50ZXJhY3Rpb25CdWxrKHBhdGgsIGNvbmRpdGlvbklkLCBpbnRlcmFjdGlvblR5cGUsIGJ1bGtTaXplLCB0aGlzLmxvZ0ludGVyYWN0aW9uQnVsa1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLy8gUHJvY2VkdXJlIHJlbGF0ZWQgbWV0aG9kc1xuXG4gICAgc3RhcnRQcm9jZWR1cmUoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZXMvc3RhcnRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHt9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRIZWFkZXJzKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICAgIH1cblxuICAgIG5leHRQcm9jZWR1cmUoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZXMvbmV4dFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZW5kUHJvY2VkdXJlKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL2VuZFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY3VycmVudFByb2NlZHVyZVN0ZXAoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZS1zdGVwc1wiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY2hlY2tTdXJ2ZXlSZXN1bHQoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICBwYXRoOiBcInByb2NlZHVyZXMvY2hlY2stc3VydmV5LXJlc3VsdFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEhlYWRlcnMob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc3RhcnROYXZpZ2F0b3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSB1c2VyIHRva2VuICh1dWlkKVxuICAgICAgICAgICAgdGhpcy5tZSgpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5ib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRpY2lwYW50VG9rZW4gPSByZXNwb25zZS5ib2R5LnRva2VuO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmFwaVVybCArIFwiL1wiICsgXCJwcm9jZWR1cmVzL25hdmlnYXRvcj9wYXJ0aWNpcGFudD1cIiArIHBhcnRpY2lwYW50VG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3NlID0gbmV3IEV2ZW50U291cmNlKHVybCwge3dpdGhDcmVkZW50aWFsczogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlBhcnRpY2lwYW50IG5vdCBmb3VuZFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsb3NlTmF2aWdhdG9yKCkge1xuICAgICAgICB0aGlzLnNzZS5jbG9zZSgpO1xuICAgIH1cblxuICAgIHJlY29ubmVjdE5hdmlnYXRvcigpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgIHBhdGg6IFwicHJvY2VkdXJlcy9uYXZpZ2F0b3IvcmVjb25uZWN0XCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0SGVhZGVycyhvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXROYXZpZ2F0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNzZTtcbiAgICB9XG5cbiAgICB1cGRhdGVOYXZpZ2F0b3IocGFydGljaXBhbnRUb2tlbjogc3RyaW5nLCBzb3VyY2U6IE5hdmlnYXRvclNvdXJjZSwgc3RhdGU6IE5hdmlnYXRvclN0YXRlLCBleHRJZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgcGF0aDogXCJwcm9jZWR1cmVzL25hdmlnYXRvclwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5ib2R5ID0ge1xuICAgICAgICAgICAgcGFydGljaXBhbnRfdG9rZW46IHBhcnRpY2lwYW50VG9rZW4sXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgIGV4dF9pZDogZXh0SWRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgICB9XG5cbn1cbmV4cG9ydCBkZWZhdWx0IFN0dWR5QWxpZ25MaWI7Il0sInNvdXJjZVJvb3QiOiIifQ==