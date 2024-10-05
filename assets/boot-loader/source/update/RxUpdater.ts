import { sys } from "cc";
import { IRxUpdater, RxUpdaterImpl } from "./RxUpdaterImpl";
import { RxUpdaterImplApp } from "./RxUpdaterImplApp";
import { RxUpdaterImplWeb } from "./RxUpdaterImplWeb";

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

    private constructor() {
        if (sys.isBrowser) {
            this._impl = new RxUpdaterImplWeb(this);
        } else {
            this._impl = new RxUpdaterImplApp(this);
        }
    }

    /**
     * 正在检查更新
     */
    public on_check_update() {}

    /**
     * 准备开始更新
     */
    public on_update_start() {}

    /**
     * 更新进度
     * @param total 总量
     * @param loaded 完成量
     * @param filename 当前文件名
     */
    public on_update_progress(total: number, loaded: number, filename?: string) {}

    /**
     * 更新完成
     */
    public on_update_complete() {}

    /**
     * 更新错误
     * @param error 错误信息
     */
    public on_update_error(error: string) {}

    /**
     * 启动更新程序
     */
    public start() {
        this._impl.check_update();
    }
}
