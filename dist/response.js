"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondHtml = respondHtml;
exports.redirect = redirect;
function respondHtml(res, status, body) {
    res.writeHead(status, {
        "content-type": "text/html",
        "content-encoding": "utf-8"
    });
    res.end(body);
}
function redirect(res, newUrl) {
    res.writeHead(301, {
        "location": newUrl
    });
    res.end();
}
exports.default = {
    respondHtml,
    redirect
};
