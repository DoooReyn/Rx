import { JsonAsset, assetManager, director, sys } from "cc";
import { RxUpdater } from "./RxUpdater";
import { RxUpdaterImpl } from "./RxUpdaterImpl";
import { PREVIEW } from "cc/env";

/**
 * 热更新实现之 Web
 */
export class RxUpdaterImplWeb extends RxUpdaterImpl {
    public checkUpdate(): void {
        super.checkUpdate();

        // 获取本地版本
        let version_local = sys.localStorage.getItem("pacakge_version") as Version;
        if (!version_local) {
            version_local = _RxSystemSettings.package_version;
            sys.localStorage.setItem("package_version", version_local);
        }
        RxUpdater.inst.logger.i("本地版本", version_local);

        // 是否有需要跳过更新的情况
        if (!_RxSystemSettings.check_update || _RxSystemSettings.upgrage_strategy == "suspend") {
            RxUpdater.inst.logger.i("跳过自动更新");
            this._listener.onUpdateSkip();
            this.doUpgrade(version_local);
            return;
        }

        // 拉取最新版本信息
        const version_url = _RxSystemSettings.res_server + "versions.json?t=" + sys.now();
        assetManager.loadRemote<JsonAsset>(version_url, (err, asset) => {
            if (err) {
                RxUpdater.inst.logger.e("拉取版本信息失败", err);
                this._listener.onUpdateError("拉取版本信息失败");
                return;
            }

            /** 最新版本信息 */
            const vinfo = asset.json as VersionInfo;
            RxUpdater.inst.logger.i("拉取版本信息成功", vinfo);

            // 检测是否需要升级
            if (!this.canUpgrade(vinfo.latest, version_local as Version, _RxSystemSettings.upgrage_strategy)) {
                RxUpdater.inst.logger.i("不需要更新");
                this._listener.onUpdateSkip();
                return;
            }

            // 准备升级
            RxUpdater.inst.logger.i("准备升级");
            this._listener.onUpdateStart();

            // 开始升级-对于 Web 来说，只需要 bundle 版本对应即可
            this.doUpgrade(vinfo.latest);
        });
    }

    /**
     * 执行升级逻辑
     * @param version 目标版本
     */
    private doUpgrade(version: Version) {
        const game_url = PREVIEW ? "game" : _RxSystemSettings.res_server + "bundle/game";
        const target = PREVIEW ? "" : version;
        assetManager.loadBundle(game_url, { version: target }, (err, bundle) => {
            if (err) {
                RxUpdater.inst.logger.e("加载主包失败", err);
                this._listener.onUpdateError("加载主包失败");
                return;
            }

            RxUpdater.inst.logger.i("加载主包成功", bundle);
            sys.localStorage.setItem("package_version", version);
            this._listener.onUpdateComplete();

            bundle.loadScene("game", (err, scene) => {
                if (err) {
                    RxUpdater.inst.logger.e("加载主场景失败", err);
                } else {
                    RxUpdater.inst.logger.i("加载主场景成功");
                    director.runScene(scene, null, function () {
                        // 升级完成，销毁 updater
                        RxUpdater.inst.logger.i("切换主场景成功");
                        RxUpdater.destroy();
                    });
                }
            });
        });
    }
}
