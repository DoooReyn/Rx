/** 全局指向 */
declare const _RxGlobals: any;

/** 环境配置 */
declare const _RxSystemSettings: {
    /**
     * 环境
     * - dev: 开发
     * - dist: 生产
     */
    env: "dev" | "dist";
    /** 资源服务器 */
    res_server: string;
    /** 发布平台 */
    platform: string;
    /** SDK */
    sdk: string;
    /** 日志等级 */
    log_level: "debug" | "info" | "warn" | "error" | "none";
    /** 是否需要检查更新 */
    check_update: boolean;
    /**
     * 更新升级策略
     * - major: 跟踪大版本
     * - minor: 跟踪小版本
     * - patch: 跟踪补丁版本
     * - suspend: 暂停升级
     */
    upgrage_strategy: "patch" | "minor" | "major" | "suspend";
    /** 当前包的版本号 */
    package_version: `${number}.${number}.${number}`;
};
