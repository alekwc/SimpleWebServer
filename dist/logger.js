"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
class Logger {
    created;
    filepath;
    enabled;
    writeDebug;
    async createLogFile() {
        await promises_1.default.writeFile(this.filepath, `----- NEW LOG FILE CREATED AT ${(new Date).toLocaleString().toUpperCase()} ----`);
        this.created = true;
    }
    constructor(enabled = true, writeDebug = true, filepath) {
        this.enabled = enabled;
        this.writeDebug = writeDebug;
        this.created = false;
        this.filepath = filepath ?? `./logs/${Date.now()}.log`;
    }
    async log(message, level) {
        if ((level === "DEBUG" && !this.writeDebug) || !this.enabled)
            return;
        await promises_1.default.appendFile(this.filepath, `\n${(new Date()).toLocaleString().replace(" ", "")} ${`[${level}]`.padEnd(9)} ${message}`);
    }
}
exports.Logger = Logger;
