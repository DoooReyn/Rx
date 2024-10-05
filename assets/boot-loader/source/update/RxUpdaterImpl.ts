import { RxBootScene } from "../RxBootScene";

/** 事件：检查更新 */
export const EVENT_UPDATE_CHECK = "EVENT_UPDATE_CHECK";
/** 事件：更新开始 */
export const EVENT_UPDATE_START = "EVENT_UPDATE_START";
/** 事件：更新进度 */
export const EVENT_UPDATE_PROGRESS = "EVENT_UPDATE_PROGRESS";
/** 事件：更新结束 */
export const EVENT_UPDATE_COMPLETE = "EVENT_UPDATE_COMPLETE";
/** 事件：更新失败 */
export const EVENT_UPDATE_ERROR = "EVENT_UPDATE_ERROR";

/** 更新器需要实现的接口 */
export interface IRxUpdater {
    on_check_update: () => void;
    on_update_start: () => void;
    on_update_progress: (total: number, loaded: number, filename?: string) => void;
    on_update_complete: () => void;
    on_update_error: (error: string) => void;
}

/**
 * 热更新实现
 */
export class RxUpdaterImpl {
    protected _listener: IRxUpdater;

    public constructor(listener: IRxUpdater) {
        this._listener = listener;
    }

    public check_update() {
        RxBootScene.inst.state = "check-update";
    }
}
