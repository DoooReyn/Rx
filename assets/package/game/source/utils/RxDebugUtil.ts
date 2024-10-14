import { Director, director, game, sys, Texture2D } from "cc";
import { Rx } from "../Rx";
import { PREVIEW } from "cc/env";

/**
 * 调试工具
 * @description 这里的纹理指的是 Texture2D，而非 gl.Texture
 */
export class RxDebugUtil {
    /** 当前纹理映射 */
    private _texturesMap: Map<number, Texture2D>;

    /** 纹理日志记录 */
    private _texturesLog: Map<number, string[]>;

    /**
     * @param _verbose 是否输出详细信息
     */
    constructor(private _verbose: boolean = false) {
        this._texturesMap = new Map();
        this._texturesLog = new Map();
    }

    /** 是否输出详细信息 */
    get verbose() {
        return this._verbose;
    }
    set verbose(v: boolean) {
        this._verbose = v;
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
        const that = this;
        // @ts-ignore
        const create = Texture2D.prototype._createTexture;
        const destroy = Texture2D.prototype.destroy;
        // @ts-ignore
        Texture2D.prototype._createTexture = function () {
            const self = this as Texture2D;
            const hash = self.getHash();
            that._texturesMap.set(this.getHash(), this);
            that.addTextureLog("创建纹理", hash);
            return create.apply(this, arguments);
        };
        Texture2D.prototype.destroy = function () {
            const self = this as Texture2D;
            const hash = self.getHash();
            that._texturesMap.delete(hash);
            that.addTextureLog("销毁纹理", hash);
            return destroy.apply(this, arguments);
        };
        if (PREVIEW && sys.isBrowser) {
            director.on(Director.EVENT_AFTER_DRAW, this.sync, this);
        }
    }

    /**
     * 添加纹理日志
     * @param header 日志头
     * @param hash 纹理哈希值
     */
    private addTextureLog(header: string, hash: number) {
        if (this._verbose) {
            const head = `${header}<${hash}>`;
            const stack = [head, RxDebugUtil.getErrorStack(6)].join("\n");
            Rx.logger.d(head);
            if (this._texturesLog.has(hash)) {
                this._texturesLog.get(hash).push(stack);
            } else {
                this._texturesLog.set(hash, [stack]);
            }
        }
    }

    /** 当前纹理数量 */
    public get textureCount() {
        return this._texturesMap.size;
    }

    /**
     * 打印纹理日志
     * @param hashOrTexture 纹理哈希值或者纹理对象
     */
    public dumpTextureLog(hashOrTexture: number | Texture2D) {
        let hash: number;
        if (hashOrTexture instanceof Texture2D) {
            hash = hashOrTexture.getHash();
        } else {
            hash = hashOrTexture;
        }

        if (this._texturesLog.has(hash)) {
            this._texturesLog.get(hash).forEach((v) => Rx.logger.d(v));
        }
    }

    /**
     * 同步调试信息
     */
    public sync() {
        const dc = director.root.device.numDrawCalls;
        const fps = director.root.fps || (1 / game.deltaTime) | 0;
        const tex = director.root.device.memoryStatus.textureSize / 1024 / 1024;
        const buffer = director.root.device.memoryStatus.bufferSize / 1024 / 1024;
        const renderer = director.root.device.renderer;
        const triangles = director.root.device.numTris;
        const textures = this.textureCount;
        if (document.querySelector("#dev-stat")) {
            document.querySelector("#dev-stat-device").textContent = `设备信息: ${renderer}`;
            document.querySelector("#dev-stat-triangles").textContent = `三角面数: ${triangles}`;
            document.querySelector("#dev-stat-drawcalls").textContent = `绘制调用: ${dc}`;
            document.querySelector("#dev-stat-fps").textContent = `实时帧率: ${fps}/s`;
            document.querySelector("#dev-stat-textures").textContent = `纹理数量: ${textures}`;
            document.querySelector("#dev-stat-texSize").textContent = `纹理内存: ${tex.toFixed(2)}M`;
            document.querySelector("#dev-stat-bufSize").textContent = `纹理缓冲: ${buffer.toFixed(2)}M`;
        }
    }

    public static getErrorStack(depth: number) {
        return new Error().stack.split("\n").slice(depth).join("\n");
    }
}
