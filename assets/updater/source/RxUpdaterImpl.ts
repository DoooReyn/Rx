/** 更新器需要实现的接口 */
export interface IRxUpdater {
    onUpdateChecking: () => void;
    onUpdateStart: () => void;
    onUpdateProgress: (total: number, loaded: number, filename?: string) => void;
    onUpdateComplete: () => void;
    onUpdateError: (error: string) => void;
}

/**
 * 热更新实现
 */
export class RxUpdaterImpl {
    protected _listener: IRxUpdater;

    public constructor(listener: IRxUpdater) {
        this._listener = listener;
    }

    public checkUpdate() {
        this._listener.onUpdateChecking();
    }
}
