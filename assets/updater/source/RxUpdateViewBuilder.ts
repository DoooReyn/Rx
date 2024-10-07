import { Component, Constructor, Label, Node, ProgressBar, Scene } from "cc";

/** 视图工具 */
class ViewUtil {
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
}

/** 热更新视图 */
export interface IUpdateView {
    /** 场景 */
    v_scene: Scene;
    /** 画布 */
    v_canvas: Node;
    /** 容器 */
    v_update: Node;
    /** 进度条 */
    v_bar: ProgressBar;
    /** 进度标签 */
    v_rate: Label;
}

/**
 * 构建热更新视图
 * @param scene 热更新场景
 * @returns 
 */
export function BuildUpdateView(scene: Scene): IUpdateView {
    const v_canvas = ViewUtil.SeekChild(scene, "Canvas");
    const v_update = ViewUtil.SeekChild(v_canvas, "Update");
    const v_bar = ViewUtil.SeekComponent(v_update, "UpdateBar", ProgressBar);
    const v_rate = ViewUtil.SeekComponent(v_update, "Label", Label);
    return { v_scene: scene, v_canvas, v_update, v_bar, v_rate };
}