/** 全局指向 */
declare const _RxGlobals: any;

/**
 * 环境
 * - dev: 开发
 * - dist: 生产
 */
declare type Env = "dev" | "dist";

/**
 * 升级策略
 * - major: 跟踪大版本
 * - minor: 跟踪小版本
 * - patch: 跟踪补丁版本
 * - suspend: 暂停升级
 */
declare type UpgradeStrategy = "patch" | "minor" | "major" | "suspend";

/** 日志等级 */
declare type LogLevel = "debug" | "info" | "warn" | "error" | "none";

/** 版本类型: 如 '1.2.3' */
declare type Version = `${number}.${number}.${number}`;

/** 固定长度字符串了下 */
declare type FixedLengthString<T extends number> = string & { length: T };

/** 版本信息 */
declare interface VersionInfo {
    /** 最新版本 */
    latest: Version;
}

/** 环境配置 */
declare const _RxSystemSettings: {
    /** 环境 */
    env: Env;
    /** 资源服务器 */
    res_server: string;
    /** 发布平台 */
    platform: string;
    /** SDK */
    sdk: string;
    /** 显示调试信息 */
    show_stats: boolean;
    /** 日志等级 */
    log_level: LogLevel;
    /** 是否需要检查更新 */
    check_update: boolean;
    /** 更新升级策略 */
    upgrage_strategy: UpgradeStrategy;
    /** 当前包的版本号 */
    package_version: Version;
};
