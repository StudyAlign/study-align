type InteractionTypes = "mouseInteractionList" | "dragInteractionList" | "keyboardInteractionList" | "touchInteractionList" | "genericInteractionList"

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