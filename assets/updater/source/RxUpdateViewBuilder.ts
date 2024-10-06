import { Component, Constructor, Label, Node, ProgressBar, Scene } from "cc";

export class RxUpdateViewBuilder {
    /**
     * 查找节点
     * @param root 根节点
     * @param path 相对路径
     * @returns
     */
    public static SeekChild(root: Node, path: string): Node | null {
        return root.getChildByPath(path);
    }

    /**
     * 查找组件
     * @param root 根节点
     * @param path 相对路径
     * @param type 组件类型
     * @returns
     */
    public static SeekComponent<T extends Component>(root: Node, path: string, type: Constructor<T>): T | null {
        const child = this.SeekChild(root, path);
        return child ? child.getComponent(type) : null;
    }

    /** 构建更新视图 */
    public static build(scene: Scene): IUpdateView {
        const v_canvas = this.SeekChild(scene, "Canvas");
        const v_update = this.SeekChild(v_canvas, "Update");
        const v_bar = this.SeekComponent(v_update, "UpdateBar", ProgressBar);
        const v_rate = this.SeekComponent(v_update, "Label", Label);
        return { v_scene: scene, v_canvas, v_update, v_bar, v_rate };
    }
}

export interface IUpdateView {
    v_scene: Scene;
    v_canvas: Node;
    v_update: Node;
    v_bar: ProgressBar;
    v_rate: Label;
}