import { Component, Constructor, Label, Node, ProgressBar, Scene } from "cc";

export class ViewUtil {
    static get_child(root: Node, path: string): Node | null {
        return root.getChildByPath(path);
    }

    static get_component<T extends Component>(root: Node, path: string, type: Constructor<T>): T | null {
        const child = this.get_child(root, path);
        return child ? child.getComponent(type) : null;
    }
}

export type BootState = "none" | "check-update" | "upgrading" | "complete" | "error";

export class RxBootScene {
    private static _inst: RxBootScene;
    public static get inst() {
        return (this._inst ??= new RxBootScene());
    }

    public v_canvas: Node;
    public v_update: Node;
    public v_bar: ProgressBar;
    public v_rate: Label;

    private _state: BootState;

    public initialize(scene: Scene) {
        this.v_canvas = ViewUtil.get_child(scene, "Canvas");
        this.v_update = ViewUtil.get_child(scene, "Canvas/Update");
        this.v_bar = ViewUtil.get_component(scene, "Canvas/Update/UpdateBar", ProgressBar);
        this.v_rate = ViewUtil.get_component(scene, "Canvas/Update/Label", Label);

        this.state = "none";
    }

    get state() {
        return this._state;
    }

    set state(s: BootState) {
        if (s === this._state) return;

        this._state = s;
        switch (s) {
            case "none":
                this.v_update.active = false;
                this.v_rate.string = "";
                this.v_bar.progress = 0;
                console.log("BootScene初始化完成");
                break;
            case "check-update":
                this.v_update.active = true;
                this.v_rate.string = "正在检查更新";
                this.v_bar.progress = 0;
                break;
            case "upgrading":
                this.v_update.active = true;
                this.v_rate.string = "正在下载更新";
                this.v_bar.progress = 0;
                break;
            case "complete":
                this.v_update.active = true;
                this.v_rate.string = "更新完成";
                this.v_bar.progress = 1;
                break;
            default:
                break;
        }
    }
}
