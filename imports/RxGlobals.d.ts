/** 环境配置 */
declare const _RxSettings: {
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
    /** 
     * 升级策略
     * - major: 跟踪大版本
     * - minor: 跟踪小版本
     * - patch: 跟踪补丁版本
     * - suspend: 暂停升级
     */
    upgrage_strategy: "patch" | "minor" | "major" | "suspend";
    /** 内部版本号 */
    internal_version: `${number}.${number}.${number}`;
};


