import { sys } from "cc";

/** 颜色格式：调试日志 */
const FORMAT_DEBUG = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgba(172,84,222,0.5);";
/** 颜色格式：一般日志 */
const FORMAT_LOG = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgb(24,182,132);";
/** 颜色格式：信息日志 */
const FORMAT_INFO = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgba(32,128,255);"
/** 颜色格式：警告日志 */
const FORMAT_WARN = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgba(255,160,60);";
/** 颜色格式：错误日志 */
const FORMAT_ERROR = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgb(224,88,88);";
/** 颜色格式：标记 */
const FORMAT_TAG = "padding:4px;font-size:12px;font-weight:bold;color:black;background-color:rgb(88,192,88);";
/** 颜色格式：标记 */
const FORMAT_DATE = "padding:4px;font-size:12px;color:black;background-color:rgb(232,232,232);";
/** 是否使用颜色日志 */
const USE_COLOR = sys.isBrowser && !sys.isMobile;
/** 获取当前日期字符串 */
const getDateString = function () {
    const d = new Date();
    return d.toLocaleString() + "." + d.getMilliseconds();
};
/** 颜色日志 */
class ColorLogger {
    /** 输出调试日志 */
    static readonly d = function (tag: string, ...args: any[]) {
        console.debug("%c%s%cDEBUG%c%s", FORMAT_DATE, getDateString(), FORMAT_DEBUG, FORMAT_TAG, tag, ...args);
    };
    /** 输出一般日志 */
    static readonly l = function (tag: string, ...args: any[]) {
        console.log("%c%s%cLOG%c%s", FORMAT_DATE, getDateString(), FORMAT_LOG, FORMAT_TAG, tag, ...args);
    };
    /** 输出信息日志 */
    static readonly i = function (tag: string, ...args: any[]) {
        console.info("%c%s%cINFO%c%s", FORMAT_DATE, getDateString(), FORMAT_INFO, FORMAT_TAG, tag, ...args);
    };
    /** 输出警告日志 */
    static readonly w = function (tag: string, ...args: any[]) {
        console.warn("%c%s%cWARN%c%s", FORMAT_DATE, getDateString(), FORMAT_WARN, FORMAT_TAG, tag, ...args);
    };
    /** 输出错误日志 */
    static readonly e = function (tag: string, ...args: any[]) {
        console.error("%c%s%cERROR%c%s", FORMAT_DATE, getDateString(), FORMAT_ERROR, FORMAT_TAG, tag, ...args);
    };
}
/** 一般日志 */
class GeneralLogger {
    /** 输出调试日志 */
    static readonly d = function (tag: string, ...args: any[]) {
        console.debug(getDateString(), "DEBUG", tag, ...args);
    }
    /** 输出一般日志 */
    static readonly l = function (tag: string, ...args: any[]) {
        console.log(getDateString(), "LOG", tag, ...args);
    }
    /** 输出信息日志 */
    static readonly i = function (tag: string, ...args: any[]) {
        console.info(getDateString(), "INFO", tag, ...args);    
    }
    /** 输出警告日志 */
    static readonly w = function (tag: string, ...args: any[]) {
        console.warn(getDateString(), "WARN", tag, ...args);
    }
    /** 输出错误日志 */
    static readonly e = function (tag: string, ...args: any[]) {
        console.error(getDateString(), "ERROR", tag, ...args);
    }
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
            this.getMethod(level)(this.tag, ...args);
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
