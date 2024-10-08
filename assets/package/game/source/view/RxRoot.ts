import { Scene, Canvas } from "cc";

/** 根容器 */
export class RxRoot {
    /** 舞台 */
    public stage: Scene;
    public canvas: Canvas;

    public initialize(scene: Scene) {
        this.stage = scene;
        this.canvas = scene.getChildByName("Canvas").getComponent(Canvas);
    }
}
