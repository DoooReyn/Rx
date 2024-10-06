import { Component, Constructor, Label, Node, ProgressBar, Scene, macro } from "cc";

/**
 * 查找节点
 * @param root 根节点
 * @param path 相对路径
 * @returns
 */
function SeekChild(root: Node, path: string): Node | null {
    return root.getChildByPath(path);
}

/**
 * 查找组件
 * @param root 根节点
 * @param path 相对路径
 * @param type 组件类型
 * @returns
 */
function SeekComponent<T extends Component>(root: Node, path: string, type: Constructor<T>): T | null {
    const child = SeekChild(root, path);
    return child ? child.getComponent(type) : null;
}

/** 热更新状态 */
type UpdateState = "none" | "check-update" | "upgrading" | "complete" | "error";

/**
 * 热更新场景
 */
export class RxUpdateScene {
    /** 热更新场景实例对象 */
    private static _inst: RxUpdateScene;
    /** 获取热更新场景单例 */
    public static get inst() {
        return (this._inst ??= new RxUpdateScene());
    }

    /** 画布根节点 */
    public v_canvas: Node;
    /** 热更新容器 */
    public v_update: Node;
    /** 进度条 */
    public v_bar: ProgressBar;
    /** 进度标签 */
    public v_rate: Label;
    /** 当前状态 */
    private _state: UpdateState;

    /**
     * 初始化
     * @description 查找更新界面中的重要节点，并初始化状态为 `none`
     * @param scene 当前场景
     */
    public initialize(scene: Scene) {
        this.v_canvas = SeekChild(scene, "Canvas");
        this.v_update = SeekChild(this.v_canvas, "Update");
        this.v_bar = SeekComponent(this.v_update, "UpdateBar", ProgressBar);
        this.v_rate = SeekComponent(this.v_update, "Label", Label);

        this.state = "none";
    }

    /** 当前状态 */
    get state() {
        return this._state;
    }
    set state(s: UpdateState) {
        if (s === this._state) return;

        this._state = s;
        switch (s) {
            case "none":
                this.v_update.active = false;
                this.v_bar.progress = 0;
                this.v_rate.unschedule(this.onChecking);
                this.v_rate.string = "";
                break;
            case "check-update":
                this.v_update.active = true;
                this.v_bar.progress = 0;
                this.v_rate.string = "正在检查更新";
                this.v_rate.schedule(this.onChecking, 0.5, macro.REPEAT_FOREVER);
                break;
            case "upgrading":
                this.v_update.active = true;
                this.v_bar.progress = 0;
                this.v_rate.string = "正在下载更新";
                this.v_rate.unschedule(this.onChecking);
                break;
            case "complete":
                this.v_update.active = true;
                this.v_bar.progress = 1;
                this.v_rate.string = "更新完成";
                this.v_rate.unschedule(this.onChecking);
                break;
            default:
                break;
        }
    }

    private onChecking() {
        (this as unknown as Label).string = "正在检查更新" + ".".repeat((Math.floor(Date.now() / 1000) % 3) + 1);
    }
}
