const navigatorUpdate = new Promise( (resolve, reject) => {

    const limeSurveyAccessCode = "{TOKEN}";
    const a = limeSurveyAccessCode.slice(0, 8);
    const b = limeSurveyAccessCode.slice(8, 12);
    const c = limeSurveyAccessCode.slice(12, 16);
    const d = limeSurveyAccessCode.slice(16, 20);
    const e = limeSurveyAccessCode.slice(20);
    const h = "-";
    const participantToken = [a, h, b, h, c, h, d, h, e].join('');

    const surveyId = "{SID}";

    // Edit
    let url = "http://localhost:8000"
    const body = {
        "source": "limesurvey",
        "ext_id": surveyId, // limesurvey ID
        "participant_token": participantToken, // participant token (limesurvey access code in uuid format)
        //"procedure_step_id": 0, // optional! deprecated?
        "state": "done" // can be "in_progress" or "done"
    };

    url = url + "/api/v1/procedures/navigator"; //url to your study-align backend
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
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
                requestBody: body
            });
        }
    };
    xhr.onerror = () => {
        reject({
            status: xhr.status,
            statusText: xhr.statusText,
            requestBody: body
        });
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(body));
});

navigatorUpdate.then(response => {
    console.log(response);
}).catch(error => {
    console.log(error);
});