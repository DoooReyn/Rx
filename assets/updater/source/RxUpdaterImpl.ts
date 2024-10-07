/** 更新器需要实现的接口 */
export interface IRxUpdater {
    onUpdateChecking: () => void;
    onUpdateStart: () => void;
    onUpdateProgress: (total: number, loaded: number, filename?: string) => void;
    onUpdateComplete: () => void;
    onUpdateError: (error: string) => void;
    onUpdateSkip: () => void;
}

/**
 * 热更新实现
 */
export class RxUpdaterImpl {
    /**
     * @param _listener 监听器
     */
    public constructor(protected _listener: IRxUpdater) {}

    /** 检查更新 */
    public checkUpdate() {
        this._listener.onUpdateChecking();
    }

    /**
     * 检测版本是否可以升级
     * @param latest 最新版本
     * @param current 当前版本
     * @param strategy 升级策略
     * @returns
     */
    protected canUpgrade(latest: Version, current: Version, strategy: UpgradeStrategy): boolean {
        const [l1, l2, l3] = latest.split(".").map((v) => +v);
        const [c1, c2, c3] = current.split(".").map((v) => +v);
        switch (strategy) {
            case "major":
                // 大版本高于当前版本才允许升级
                return l1 > c1;
            case "minor":
                // 大版本不低于当前版本且和小版本高于当前版本才允许升级
                return l1 >= c1 && l2 > c2;
            case "patch":
                // 大版本和小版本不低于当前版本，且补丁版本高于当前版本才允许升级
                return l1 >= c1 && l2 >= c2 && l3 > c3;
            default:
                return false;
        }
    }
}
