import { sys } from "cc";

/** 颜色格式：调试日志 */
const FORMAT_DEBUG = "padding:4px;font-weight:bold;color:black;background-color:rgb(180,180,180);"
/** 颜色格式：一般日志 */
const FORMAT_LOG = "padding:4px;font-weight:bold;color:black;background-color:rgb(60,200,60);"
/** 颜色格式：信息日志 */
const FORMAT_INFO = "padding:4px;font-weight:bold;color:black;background-color:rgb(60,132,224);"
/** 颜色格式：警告日志 */
const FORMAT_WARN = "padding:4px;font-weight:bold;color:black;background-color:rgb(224,180,60);"
/** 颜色格式：错误日志 */
const FORMAT_ERROR = "padding:4px;font-weight:bold;color:black;background-color:rgb(224,60,60);"
/** 是否使用颜色日志 */
const USE_COLOR = sys.isBrowser && !sys.isMobile;
/** 颜色日志 */
class ColorLogger {
    /** 输出调试日志 */
    static readonly d = console.debug.bind(console, "%cD", FORMAT_DEBUG);
    /** 输出一般日志 */
    static readonly l = console.log.bind(console, "%cL", FORMAT_LOG);
    /** 输出信息日志 */
    static readonly i = console.info.bind(console, "%cI", FORMAT_INFO);
    /** 输出警告日志 */
    static readonly w = console.warn.bind(console, "%cW", FORMAT_WARN);
    /** 输出错误日志 */
    static readonly e = console.error.bind(console, "%cE", FORMAT_ERROR);
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

/** Rx 日志代理 */
export const RxLogger = USE_COLOR ? ColorLogger : GeneralLogger;
