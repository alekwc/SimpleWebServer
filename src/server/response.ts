import http from "node:http";

export function respondHtml(
    res: http.ServerResponse,
    status: number,
    body: string
): void {
    res.writeHead(status, {
        "content-type": "text/html",
        "content-encoding": "utf-8"
    });

    res.end(body);
}

export function redirect(
    res: http.ServerResponse,
    newUrl: string
): void {
    res.writeHead(301, {
        "location": newUrl
    })

    res.end();
}

export default {
    respondHtml,
    redirect
}