import { sys } from "cc";
import { Rx } from "../Rx";

/** 颜色格式：调试日志 */
const FORMAT_DEBUG = "padding:4px;font-weight:bold;color:black;background-color:rgb(180,180,180);";
/** 颜色格式：一般日志 */
const FORMAT_LOG = "padding:4px;font-weight:bold;color:black;background-color:rgb(60,200,60);";
/** 颜色格式：信息日志 */
const FORMAT_INFO = "padding:4px;font-weight:bold;color:black;background-color:rgb(60,132,224);";
/** 颜色格式：警告日志 */
const FORMAT_WARN = "padding:4px;font-weight:bold;color:black;background-color:rgb(224,180,60);";
/** 颜色格式：错误日志 */
const FORMAT_ERROR = "padding:4px;font-weight:bold;color:black;background-color:rgb(224,60,60);";
/** 颜色格式：标记 */
const FORMAT_TAG = "padding:4px;font-weight:bold;color:black;background-color:rgb(24,182,132);";
/** 颜色格式：标记 */
const FORMAT_DATE = "padding:4px;font-weight:bold;color:black;background-color:rgb(24,112,144);";
/** 是否使用颜色日志 */
const USE_COLOR = sys.isBrowser && !sys.isMobile;
/** 颜色日志 */
class ColorLogger {
    /** 输出调试日志 */
    static readonly d = console.debug.bind(console, "%cD%c%s", FORMAT_DEBUG, FORMAT_TAG);
    /** 输出一般日志 */
    static readonly l = console.log.bind(console, "%cL%c%s", FORMAT_LOG, FORMAT_TAG);
    /** 输出信息日志 */
    static readonly i = console.info.bind(console, "%cI%c%s", FORMAT_INFO, FORMAT_TAG);
    /** 输出警告日志 */
    static readonly w = console.warn.bind(console, "%cW%c%s", FORMAT_WARN, FORMAT_TAG);
    /** 输出错误日志 */
    static readonly e = console.error.bind(console, "%cE%c%s", FORMAT_ERROR, FORMAT_TAG);
}
/** 一般日志 */
class GeneralLogger {
    /** 输出调试日志 */
    static readonly d = console.debug.bind(console, "[D]");
    /** 输出一般日志 */
    static readonly l = console.log.bind(console, "[L]");
    /** 输出信息日志 */
    static readonly i = console.info.bind(console, "[I]");
    /** 输出警告日志 */
    static readonly w = console.warn.bind(console, "[W]");
    /** 输出错误日志 */
    static readonly e = console.error.bind(console, "[E]");
}
/** 日志代理 */
const logger = USE_COLOR ? ColorLogger : GeneralLogger;

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
        let method = logger.d;
        switch (level) {
            case LogLevel.Debug:
                method = logger.d;
                break;
            case LogLevel.Log:
                method = logger.l;
                break;
            case LogLevel.Info:
                method = logger.i;
                break;
            case LogLevel.Warn:
                method = logger.w;
                break;
            case LogLevel.Error:
                method = logger.e;
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
            args.unshift(this.tag, Rx.debug.now.toFixed(2));
            this.getMethod(level).apply(logger, args);
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
