type InteractionTypes = "mouseInteractionList" | "dragInteractionList" | "keyboardInteractionList" | "touchInteractionList" | "genericInteractionList"

type NavigatorSource = "condition" | "limesurvey" | "surveymonkey"
type NavigatorState = "in_progress" | "done"

interface Options {
    path: string;
    method: "GET" | "POST" | "PATCH";
    headers?: object;
    params?: object;
    body?: object;
    formData?: boolean;
    asQuery?: boolean;
    onload?: any;
    onprogress?: any;
    onerror?: any;
}