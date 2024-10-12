import { Director, Game, assetManager, director, game, sys } from "cc";
import { logger } from "./RxUpdateLogger";
import { BuildUpdateView } from "./RxUpdateViewBuilder";
import { RxUpdateViewCtroller } from "./RxUpdateViewCtroller";
import { IRxUpdater, RxUpdaterImpl } from "./RxUpdaterImpl";
import { RxUpdaterImplApp } from "./RxUpdaterImplApp";
import { RxUpdaterImplWeb } from "./RxUpdaterImplWeb";
import { DEBUG, EDITOR } from "cc/env";

/**
 * 热更新管理器
 */
export class RxUpdater implements IRxUpdater {
    /** 热更新管理器实例对象 */
    private static _inst: RxUpdater;
    /** 获取热更新管理器单例 */
    public static get inst() {
        return (this._inst ??= new RxUpdater());
    }
    /** 销毁热更新管理器单例 */
    public static destroy() {
        if (this._inst) {
            this._inst = null;
        }
    }
    /**
     * 热更新具体方案
     * @description 根据平台自动选择方案
     *
     * 这里分成 web 和 app 两种方案的原因是：
     *
     * - web 没有文件系统，只有浏览器缓存，因此只要前端保证拿到对应的版本即可
     * - app 没有浏览器缓存，只有文件系统，因此更新时需要将文件下载保存到本地，然后切换搜索路径
     */
    private _impl: RxUpdaterImpl;
    private _ctrl: RxUpdateViewCtroller;
    public readonly logger = logger;

    /** 初始化热更新管理器 */
    public initialize() {
        _RxGlobals.logger = logger;
        // 引擎初始化
        game.once(Game.EVENT_ENGINE_INITED, this.onEngineInited, this);
        // 系统初始化
        game.once(Game.EVENT_GAME_INITED, this.onGameInited, this);
    }

    /** 引擎初始化完成回调 */
    private onEngineInited() {
        this.logger.d("引擎初始化完成");
        assetManager.downloader.maxConcurrency = 16;
        assetManager.downloader.maxRequestsPerFrame = 16;
        assetManager.downloader.retryInterval = DEBUG ? 100 : 1000;
        assetManager.downloader.maxRetryCount = DEBUG ? 0 : 3;
    }

    /** 系统初始化完成回调 */
    private onGameInited() {
        this.logger.d("系统初始化完成");
        director.loadScene("update", this.onSceneLaunched.bind(this));
    }

    /** 热更新场景加载完成回调 */
    private onSceneLaunched() {
        director.once(Director.EVENT_END_FRAME, this.onSceneBuilt, this);
    }

    /** 热更新场景构建完成回调 */
    private onSceneBuilt() {
        const scene = director.getScene();
        const view = BuildUpdateView(scene);
        this._ctrl = new RxUpdateViewCtroller(view);
        this._impl = sys.isBrowser ? new RxUpdaterImplWeb(this) : new RxUpdaterImplApp(this);
        this.start();
    }

    /**
     * 正在检查更新
     */
    public onUpdateChecking() {
        this._ctrl.showMessage("正在检查更新");
        this._ctrl.state = "check-update";
    }

    /**
     * 准备开始更新
     */
    public onUpdateStart() {
        this._ctrl.showMessage("正在启动升级程序");
        this._ctrl.state = "upgrading";
    }

    /**
     * 更新进度
     * @param total 总量
     * @param loaded 完成量
     * @param filename 当前文件名
     */
    public onUpdateProgress(total: number, loaded: number, filename?: string) {
        this._ctrl.progress = (((loaded / total) * 100) | 0) / 100;
        if (filename) {
            this._ctrl.showMessage(`正在下载：${filename}`);
        } else {
            this._ctrl.showMessage("正在下载更新，请稍候");
        }
    }

    /**
     * 更新完成
     */
    public onUpdateComplete() {
        this._ctrl.state = "complete";
    }

    /**
     * 更新跳过
     */
    public onUpdateSkip() {
        this._ctrl.state = "skip";
    }

    /**
     * 更新错误
     * @param error 错误信息
     */
    public onUpdateError(error: string) {
        this._ctrl.state = "error";
        this._ctrl.showMessage(error);
    }

    /**
     * 启动更新程序
     */
    public start() {
        this._impl.checkUpdate();
    }
}

/**
 * 只会有两个场景
 * - 热更场景
 * - 游戏场景
 */

!EDITOR && RxUpdater.inst.initialize();
