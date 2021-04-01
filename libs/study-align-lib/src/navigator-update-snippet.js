const navigatorUpdate = new Promise( (resolve, reject) => {

    // Edit
    let url = "http://localhost:8080"
    const body = {
        "source": "limesurvey",
        "ext_id": "string", // limesurvey ID
        "participant_token": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // participant uuid (token)
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