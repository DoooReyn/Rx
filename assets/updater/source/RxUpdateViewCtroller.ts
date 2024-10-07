import { macro } from "cc";
import { IUpdateView } from "./RxUpdateViewBuilder";

/** 热更新状态 */
type UpdateState = "none" | "check-update" | "upgrading" | "complete" | "error" | "skip";

/**
 * 热更新控制器
 */
export class RxUpdateViewCtroller {
    /**
     * @description 查找更新界面中的重要节点，并初始化状态为 `none`
     * @param _view 关联视图
     */
    public constructor(private readonly _view: IUpdateView) {
        this.state = "none";
    }

    /** 热更新状态 */
    private _state: UpdateState;
    /** 当前状态 */
    get state() {
        return this._state;
    }
    set state(s: UpdateState) {
        if (s === this._state) return;

        this._state = s;
        switch (s) {
            case "none":
                this._view.v_bar.node.active = false;
                this.progress = 0;
                this._view.v_rate.unscheduleAllCallbacks();
                this._view.v_rate.string = "";
                break;
            case "check-update":
                {
                    let times = 0;
                    this._view.v_bar.node.active = true;
                    this.progress = 0;
                    this._view.v_rate.string = "正在检查更新";
                    this._view.v_rate.schedule(
                        () => {
                            ++times;
                            if (times > 3) {
                                times = 0;
                            }
                            this._view.v_rate.string = "正在检查更新" + ".".repeat(times);
                        },
                        0.5,
                        macro.REPEAT_FOREVER
                    );
                }
                break;
            case "upgrading":
                this._view.v_bar.node.active = true;
                this.progress = 0;
                this._view.v_rate.string = "正在下载更新";
                this._view.v_rate.unscheduleAllCallbacks();
                break;
            case "complete":
                this._view.v_bar.node.active = true;
                this.progress = 1;
                this._view.v_rate.string = "准备进入游戏";
                this._view.v_rate.unscheduleAllCallbacks();
                break;
            case "error":
                this._view.v_bar.node.active = false;
                this.progress = 0;
                this._view.v_rate.string = "更新失败";
                this._view.v_rate.unscheduleAllCallbacks();
                break;
            case "skip":
                this._view.v_bar.node.active = false;
                this.progress = 0;
                this._view.v_rate.string = "暂无更新";
                this._view.v_rate.unscheduleAllCallbacks();
                break;
            default:
                break;
        }
    }

    /** 当前进度 */
    private _progress: number = 0;
    /** 当前进度 */
    public get progress() {
        return this._progress;
    }
    public set progress(v: number) {
        this._view.v_bar.progress = this._progress = Math.max(0, Math.min(1, v));
    }

    /** 显示信息 */
    public showMessage(msg: string) {
        this._view.v_rate.string = msg;
    }
}
