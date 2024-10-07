import { Canvas, Scene } from "cc";

/**
 * Rx 框架
 */
export namespace Rx {
    /** 根容器 */
    class Root {
        /** 舞台 */
        public stage: Scene;
        public canvas: Canvas;

        public initialize(scene: Scene) {
            this.stage = scene;
            this.canvas = scene.getChildByName("Canvas").getComponent(Canvas);
        }
    }

    export const root: Root = new Root();

    export const logger = console;
}
