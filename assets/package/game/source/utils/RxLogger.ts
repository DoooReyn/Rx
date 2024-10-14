/** 日志等级 */
export enum LogLevel {
    Debug,
    Log,
    Info,
    Warn,
    Error,
}

/**
 * 日志记录
 */
export class Logger {
    /** 共享开关 */
    public static enabled: boolean = true;

    /** 默认等级 */
    private _level: LogLevel = LogLevel.Debug;

    /**
     * @param tag 日志标签
     */
    public constructor(public readonly tag: string) {
        this._level = LogLevel.Debug;
    }

    /** 日志等级 */
    public get level() {
        return this._level;
    }
    public set level(v: LogLevel) {
        this._level = v;
    }

    /**
     * 根据日志等级获取日志方法
     * @param level 等级
     */
    private getMethod(level: LogLevel) {
        let method = _RxGlobals.logger.d;
        switch (level) {
            case LogLevel.Debug:
                method = _RxGlobals.logger.d;
                break;
            case LogLevel.Log:
                method = _RxGlobals.logger.l;
                break;
            case LogLevel.Info:
                method = _RxGlobals.logger.i;
                break;
            case LogLevel.Warn:
                method = _RxGlobals.logger.w;
                break;
            case LogLevel.Error:
                method = _RxGlobals.logger.e;
                break;
        }
        return method;
    }

    /**
     * 输出日志
     * @param level 日志等级
     * @param args 参数列表
     */
    private o(level: LogLevel, args: any[]) {
        if (!Array.isArray(args)) {
            args = [args];
        }
        if (Logger.enabled && this._level <= level && args.length > 0) {
            this.getMethod(level).apply(_RxGlobals.logger, this.tag, args);
        }
    }

    /**
     * 输出调试日志
     * @param args 参数列表
     */
    public d(...args: any[]) {
        this.o(LogLevel.Debug, args);
    }

    /**
     * 输出一般日志
     * @param args 参数列表
     */
    public l(...args: any[]) {
        this.o(LogLevel.Log, args);
    }

    /**
     * 输出信息日志
     * @param args 参数列表
     */
    public i(...args: any[]) {
        this.o(LogLevel.Info, args);
    }

    /**
     * 输出警告日志
     * @param args 参数列表
     */
    public w(...args: any[]) {
        this.o(LogLevel.Warn, args);
    }

    /**
     * 输出调错误日志
     * @param args 参数列表
     */
    public e(...args: any[]) {
        this.o(LogLevel.Error, args);
    }
}

/**
 * 日志系统
 */
export class RxLogger {
    /** UI 日志 */
    public readonly ui: Logger;
    /** 系统日志 */
    public readonly sys: Logger;
    /** WebSocket 日志 */
    public readonly ws: Logger;
    /** HTTP 日志 */
    public readonly http: Logger;

    public constructor() {
        this.ui = new Logger("ui");
        this.sys = new Logger("sys");
        this.ws = new Logger("ws");
        this.http = new Logger("http");
    }

    /** 日志开关 */
    public get enabled() {
        return Logger.enabled;
    }
    set enabled(v: boolean) {
        Logger.enabled = v;
    }
}
