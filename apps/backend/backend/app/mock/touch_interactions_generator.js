function makeid(length) {
   let result = '';
   let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/* Returns a random integer between the specified values.
The value is no lower than min (or the next integer greater than min if min isn't an integer),
and is less than (but not equal to) max.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let interactions_amount = 2000
let max_touches = 10
let events = ["touchstart", "touchend", "touchmove", "touchcancel"]
let max_x = 1920
let max_y = 1020

let schema = {
    "condition_id": 1,
    "interactions": []
}

let interaction_template = {
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "event": "touchstart",
    "time": "2020-08-10T16:54:36.720Z",
    "altKey": true,
    "ctrlKey": true,
    "metaKey": true,
    "shiftKey": true,
    "rotation": 0,
    "scale": 0,
    "changedTouches": [],
    "targetTouches": [],
    "touches": []
}

let touch_template =  {
    "uuid": "45685f64-5717-4562-b3fc-2c963f66afa6",
    "identifier": 0,
    "screenX": 0,
    "screenY": 0,
    "clientX": 0,
    "clientY": 0,
    "pageX": 0,
    "pageY": 0,
    "target": "string",
}

function getSliceWindowFromArray(touches, touchesAmount) {
    const limit = touchesAmount + 1
    let changedTouchesWindow = getRandomInt(0, limit)
    let changedTouchesStart = getRandomInt(0, limit - changedTouchesWindow)
    let changedTouchesEnd = changedTouchesStart + changedTouchesWindow
    return touches.slice(changedTouchesStart, changedTouchesEnd)
}

function makeTouch(identifier) {
    let result = Object.assign({}, touch_template)
    result.uuid = uuidv4()
    result.identifier = identifier;
    result.screenX = getRandomInt(0, max_x)
    result.screenY = getRandomInt(0, max_y)
    result.clientX = getRandomInt(0, max_x)
    result.clientY = getRandomInt(0, max_y)
    result.pageX = getRandomInt(0, max_x)
    result.pageY = getRandomInt(0, max_y)
    result.target = makeid(20)
    return result
}

function makeInteraction(identifier) {
    let d = new Date()
    d = d.setMinutes( d.getMinutes() + identifier)
    d = new Date(d)
    let result = Object.assign({}, interaction_template)
    result.uuid = uuidv4()
    result.event = events[getRandomInt(0, events.length)]
    result.time = d.toISOString();
    result.altKey = Math.random() >= 0.5
    result.ctrlKey = Math.random() >= 0.5
    result.metaKey = Math.random() >= 0.5
    result.shiftKey = Math.random() >= 0.5
    result.rotation = getRandomInt(0, 361)
    result.scale = Math.random()
    result.changedTouches = []
    result.targetTouches = []
    result.touches = []
    return result
}

function generateInteractions() {
    for (let i = 0; i < interactions_amount; i++) {
        let touches = []
        let changedTouches = []
        let targetTouches = []

        let touchesAmount = getRandomInt(1, max_touches + 1)
        for (let k = 0; k < touchesAmount; k++) {
            touches.push(makeTouch(k))
        }

        changedTouches = getSliceWindowFromArray(touches, touchesAmount)
        targetTouches = getSliceWindowFromArray(touches, touchesAmount)

        let interaction = makeInteraction(i)
        interaction.touches = touches
        interaction.changedTouches = changedTouches
        interaction.targetTouches = targetTouches

        schema.interactions.push(interaction)
    }
}

function download(schema, interaction_amount) {
    let fileContents=JSON.stringify(schema, null, 2);
    let fileName= "interaction-samples_" + interaction_amount + ".json";

    let pp = document.createElement('a');
    pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    pp.setAttribute('download', fileName);
    pp.click();
}

generateInteractions();
download(schema, interactions_amount)
console.log(schema)
