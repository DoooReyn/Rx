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
    static readonly d = function (...args: any[]) {
        console.debug("%c%s%cDEBUG%c%s", FORMAT_DATE, getDateString(), FORMAT_DEBUG, FORMAT_TAG, "update", ...args);
    };
    /** 输出一般日志 */
    static readonly l = function (...args: any[]) {
        console.log("%c%s%cLOG%c%s", FORMAT_DATE, getDateString(), FORMAT_LOG, FORMAT_TAG, "update", ...args);
    };
    /** 输出信息日志 */
    static readonly i = function (...args: any[]) {
        console.info("%c%s%cINFO%c%s", FORMAT_DATE, getDateString(), FORMAT_INFO, FORMAT_TAG, "update", ...args);
    };
    /** 输出警告日志 */
    static readonly w = function (...args: any[]) {
        console.warn("%c%s%cWARN%c%s", FORMAT_DATE, getDateString(), FORMAT_WARN, FORMAT_TAG, "update", ...args);
    };
    /** 输出错误日志 */
    static readonly e = function (...args: any[]) {
        console.error("%c%s%cERROR%c%s", FORMAT_DATE, getDateString(), FORMAT_ERROR, FORMAT_TAG, "update", ...args);
    };
}
/** 一般日志 */
class GeneralLogger {
    /** 输出调试日志 */
    static readonly d = function (...args: any[]) {
        console.debug(getDateString(), "DEBUG", "update", ...args);
    };
    /** 输出一般日志 */
    static readonly l = function (...args: any[]) {
        console.log(getDateString(), "LOG", "update", ...args);
    };
    /** 输出信息日志 */
    static readonly i = function (...args: any[]) {
        console.info(getDateString(), "INFO", "update", ...args);
    };
    /** 输出警告日志 */
    static readonly w = function (...args: any[]) {
        console.warn(getDateString(), "WARN", "update", ...args);
    };
    /** 输出错误日志 */
    static readonly e = function (...args: any[]) {
        console.error(getDateString(), "ERROR", "update", ...args);
    };
}
/** 日志代理 */
export const logger = USE_COLOR ? ColorLogger : GeneralLogger;
