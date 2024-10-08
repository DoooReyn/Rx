import { director, game, gfx, ImageAsset, sys, Texture2D } from "cc";

/**
 * 调试工具
 */
export class RxDebugUtil {
    /** 当前纹理数量 */
    private _textureMap: Map<string, Texture2D>;

    constructor() {
        this._textureMap = new Map();
    }

    public dump(output: boolean = false) {
        const drawcalls = director.root.device.numDrawCalls;
        const fps = director.root.fps || (1 / game.deltaTime) | 0;
        const texSize = director.root.device.memoryStatus.textureSize / 1024 / 1024;
        const bufSize = director.root.device.memoryStatus.bufferSize / 1024 / 1024;
        const renderer = director.root.device.renderer;
        const triangles = director.root.device.numTris;
        const textures = this.textureCount;
        if (output) {
            console.info(
                [
                    `设备信息: ${renderer}`,
                    `实时帧率: ${fps}/s`,
                    `三角面数: ${triangles}`,
                    `绘制调用: ${drawcalls}`,
                    `纹理数量: ${textures}`,
                    `纹理内存: ${texSize.toFixed(2)}M`,
                    `纹理缓冲: ${bufSize.toFixed(2)}M`,
                ].join("\n")
            );
        }
        if (document.querySelector("#dev-stat")) {
            document.querySelector("#dev-stat-triangles").textContent = `三角面数: ${triangles}`;
            document.querySelector("#dev-stat-drawcalls").textContent = `绘制调用: ${drawcalls}`;
            document.querySelector("#dev-stat-fps").textContent = `实时帧率: ${fps}/s`;
            document.querySelector("#dev-stat-textures").textContent = `纹理数量: ${textures}`;
            document.querySelector("#dev-stat-texSize").textContent = `纹理内存: ${texSize.toFixed(2)}M`;
            document.querySelector("#dev-stat-bufSize").textContent = `纹理缓冲: ${bufSize.toFixed(2)}M`;
        }
    }

    /** 当前时间 */
    public get now() {
        return performance ? performance.now() : sys.now();
    }

    /**
     * 模拟耗时的操作
     * @param waitTime 模拟的耗时，单位为ms，默认为10ms
     */
    public simulateSlowOp(waitTime: number = 10) {
        const startTime = this.now;
        while (this.now - startTime < waitTime) {}
    }

    /**
     * 监控纹理数量
     */
    public monitorTextures() {
        let customs = 0;
        const tp = Texture2D.prototype as any;
        let tp_create = tp._createTexture;
        let tp_destroy = tp.destroy;
        const that = this;
        tp._createTexture = function (d) {
            that._textureMap.set(this.toString(), this);
            tp_create.call(this, d);
        };
        tp.destroy = function () {
            that._textureMap.delete(this.toString());
            tp_destroy.call(this);
        };
    }

    public get textureCount() {
        return this._textureMap.size;
    }
}
