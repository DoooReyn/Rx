import { Label, macro } from "cc";
import { IUpdateView } from "./RxUpdateViewBuilder";

/** 热更新状态 */
type UpdateState = "none" | "check-update" | "upgrading" | "complete" | "error";

/**
 * 热更新控制器
 */
export class RxUpdateViewCtroller {
    /** 视图 */
    private view: IUpdateView;
    /**
     * @description 查找更新界面中的重要节点，并初始化状态为 `none`
     * @param scene 当前场景
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
                this._view.v_update.active = false;
                this._view.v_bar.progress = 0;
                this._view.v_rate.unschedule(this.onChecking);
                this._view.v_rate.string = "";
                break;
            case "check-update":
                this._view.v_update.active = true;
                this._view.v_bar.progress = 0;
                this._view.v_rate.string = "正在检查更新";
                this._view.v_rate.schedule(this.onChecking, 0.5, macro.REPEAT_FOREVER);
                break;
            case "upgrading":
                this._view.v_update.active = true;
                this._view.v_bar.progress = 0;
                this._view.v_rate.string = "正在下载更新";
                this._view.v_rate.unschedule(this.onChecking);
                break;
            case "complete":
                this._view.v_update.active = true;
                this._view.v_bar.progress = 1;
                this._view.v_rate.string = "更新完成";
                this._view.v_rate.unschedule(this.onChecking);
                break;
            default:
                break;
        }
    }

    private onChecking() {
        (this as unknown as Label).string = "正在检查更新" + ".".repeat((Math.floor(Date.now() / 1000) % 3) + 1);
    }
}
