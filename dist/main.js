"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const promises_1 = __importDefault(require("node:fs/promises"));
const response_1 = __importDefault(require("./response"));
const logger_1 = require("./logger");
const node_readline_1 = __importDefault(require("node:readline"));
let settings;
const logger = new logger_1.Logger();
(async () => {
    await logger.createLogFile();
    settings = await promises_1.default.readFile("./servercfg.json");
    logger.enabled = settings.logging.enabled;
    logger.writeDebug = settings.logging.log_debug;
})();
const server = node_http_1.default.createServer(async (req, res) => {
    const url = new URL(req.url ?? "", `http://${req.headers.host}`);
    await logger.log(`Got new GET request to ${url.href}`, "DEBUG");
    if (url.pathname.slice(-5) === ".html") {
        response_1.default.redirect(res, url.pathname.replace(url.pathname.slice(-5), ""));
        return;
    }
    if (["/index", "/home", "/homepage"].includes(url.pathname)) {
        response_1.default.redirect(res, "/");
        return;
    }
    if (url.pathname === "/") {
        response_1.default.respondHtml(res, 200, await promises_1.default.readFile("./public/index.html", "utf-8"));
        return;
    }
    response_1.default.respondHtml(res, 404, await promises_1.default.readFile("./public/notfound.html", "utf-8"));
    return;
});
server.on("error", async (error) => {
    await logger.log([
        `An uncaught exception has occurred:`,
        `Name: ${error.name}`,
        `Cause: ${error.cause ?? "No cause"}`,
        `Message: ${error.message}`,
        `Stack: ${error.stack || "No stack"}`
    ].join("\n"), "ERROR");
});
server.listen(3000, async () => {
    await logger.log("Server running on http://localhost:3000", "INFO");
});
const rl = node_readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (input) => {
    const command = input.split(" ");
    if (command[0] == "exit") {
        server.close();
        await logger.log("Server has been shut down by user", "INFO");
        process.exit(0);
    }
    else if (command[0] === "logging") {
        if (command[2] === "enabled") {
            logger.enabled = true;
        }
        else if (command[2] === "disabled") {
            logger.enabled = false;
        }
        else if (command[1] === "log-debug") {
            if (command[2] === "enabled") {
                logger.writeDebug = true;
            }
            else if (command[2] === "disabled") {
                logger.writeDebug = false;
            }
            else {
                console.log("Sate for 'log-debug' can only be 'enabled' or 'disabled'");
            }
        }
        else {
            console.log("Argument for 'logging' not found");
        }
    }
    else {
        console.log("Command not found");
    }
});
