import { Director, Game, assetManager, director, game, sys } from "cc";
import { RxUpdateLogger } from "./RxUpdateLogger";
import { RxUpdateViewBuilder } from "./RxUpdateViewBuilder";
import { RxUpdateViewCtroller } from "./RxUpdateViewCtroller";
import { IRxUpdater, RxUpdaterImpl } from "./RxUpdaterImpl";
import { RxUpdaterImplApp } from "./RxUpdaterImplApp";
import { RxUpdaterImplWeb } from "./RxUpdaterImplWeb";
import { DEBUG, EDITOR } from "cc/env";

/**
 * 热更新管理器
 */
class RxUpdater implements IRxUpdater {
    /** 热更新管理器实例对象 */
    private static _inst: RxUpdater;
    /** 获取热更新管理器单例 */
    public static get inst() {
        return (this._inst ??= new RxUpdater());
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

    /** 初始化热更新管理器 */
    public initialize() {
        // 引擎初始化
        game.once(Game.EVENT_ENGINE_INITED, this.onEngineInited, this);
        // 系统初始化
        game.once(Game.EVENT_GAME_INITED, this.onGameInited, this);
    }

    /** 引擎初始化完成回调 */
    private onEngineInited() {
        RxUpdateLogger.d("引擎初始化完成");
        assetManager.downloader.maxConcurrency = 16;
        assetManager.downloader.maxRequestsPerFrame = 16;
        assetManager.downloader.retryInterval = DEBUG ? 100 : 1000;
        assetManager.downloader.maxRetryCount = DEBUG ? 0 : 3;
    }

    /** 系统初始化完成回调 */
    private onGameInited() {
        RxUpdateLogger.d("系统初始化完成");
        director.loadScene("update", this.onSceneLaunched.bind(this));
    }

    /** 热更新场景加载完成回调 */
    private onSceneLaunched() {
        director.once(Director.EVENT_END_FRAME, this.onSceneBuilt, this);
    }

    /** 热更新场景构建完成回调 */
    private onSceneBuilt() {
        const scene = director.getScene();
        const view = RxUpdateViewBuilder.build(scene);
        this._ctrl = new RxUpdateViewCtroller(view);
        this._impl = sys.isBrowser ? new RxUpdaterImplWeb(this) : new RxUpdaterImplApp(this);
        this.start();
    }

    /**
     * 正在检查更新
     */
    public onUpdateChecking() {
        this._ctrl.state = "check-update";
    }

    /**
     * 准备开始更新
     */
    public onUpdateStart() {}

    /**
     * 更新进度
     * @param total 总量
     * @param loaded 完成量
     * @param filename 当前文件名
     */
    public onUpdateProgress(total: number, loaded: number, filename?: string) {}

    /**
     * 更新完成
     */
    public onUpdateComplete() {}

    /**
     * 更新错误
     * @param error 错误信息
     */
    public onUpdateError(error: string) {}

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
