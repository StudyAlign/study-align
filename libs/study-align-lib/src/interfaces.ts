type InteractionTypes = "mouseInteractionList" | "dragInteractionList" | "keyboardInteractionList" | "touchInteractionList" | "genericInteractionList"

type NavigatorSource = "condition" | "limesurvey" | "surveymonkey"
type NavigatorState = "in_progress" | "done"

interface Options {
    path: string;
    method: "GET" | "POST";
    headers?: object;
    params?: object;
    body?: object;
    onload?: any;
    onprogress?: any;
    onerror?: any;
}