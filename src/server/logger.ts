import fs from "node:fs/promises"

export class Logger {
    private created: boolean;
    private filepath: string;

    public enabled: boolean;
    public writeDebug: boolean;
    
    public async createLogFile(): Promise<void> {
        await fs.writeFile(this.filepath, `----- NEW LOG FILE CREATED AT ${(new Date).toLocaleString().toUpperCase()} ----`);

        this.created = true;
    }

    constructor(enabled: boolean = true, writeDebug: boolean = true, filepath?: string) {
        this.enabled = enabled;
        this.writeDebug = writeDebug;
        this.created = false;

        this.filepath = filepath ?? `./logs/${Date.now()}.log`;
    }

    public async log(message: string, level: "DEBUG" | "INFO" | "WARNING" | "ERROR"): Promise<void> {
        if ((level === "DEBUG" && !this.writeDebug) || !this.enabled)
            return;

        await fs.appendFile(this.filepath, `\n${(new Date()).toLocaleString().replace(" ", "")} ${`[${level}]`.padEnd(9)} ${message}`)
    }
}