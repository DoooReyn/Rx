import { JsonAsset, assetManager, director, sys } from "cc";
import { RxUpdateLogger } from "./RxUpdateLogger";
import { RxUpdaterImpl } from "./RxUpdaterImpl";

export class RxUpdaterImplWeb extends RxUpdaterImpl {
    public checkUpdate(): void {
        super.checkUpdate();

        // 检测本地是否最新版本
        let version_local = sys.localStorage.getItem("pacakge_version") as Version;
        if (!version_local) {
            version_local = _RxSystemSettings.package_version;
            sys.localStorage.setItem("package_version", version_local);
        }

        // 是否有需要跳过更新的情况
        if (!_RxSystemSettings.check_update || _RxSystemSettings.upgrage_strategy == "suspend") {
            this._listener.onUpdateSkip();
            this.doUpgrade(version_local);
            return;
        }

        // 拉取最新版本信息
        const version_url = _RxSystemSettings.res_server + "versions.json?t=" + sys.now();
        assetManager.loadRemote<JsonAsset>(version_url, (err, asset) => {
            if (err) {
                RxUpdateLogger.e("拉取版本信息失败", err);
                this._listener.onUpdateError("拉取版本信息失败");
                return;
            }

            /** 最新版本信息 */
            const vinfo = asset.json as VersionInfo;

            // 检测是否需要升级
            if (!this.canUpgrade(vinfo.latest, version_local as Version, _RxSystemSettings.upgrage_strategy)) {
                this._listener.onUpdateSkip();
                return;
            }

            // 准备升级
            this._listener.onUpdateStart();

            // 开始升级-对于 Web 来说，只需要 bundle 版本对应即可
            this.doUpgrade(vinfo.latest);
        });
    }

    private doUpgrade(version: Version) {
        const game_url = _RxSystemSettings.res_server + "bundle/game";
        assetManager.loadBundle(game_url, { version: "55b67" }, (err, bundle) => {
            if (err) {
                RxUpdateLogger.e("加载主包失败", err);
                this._listener.onUpdateError("加载主包失败");
                return;
            }

            assetManager.downloader.appendTimeStamp = false;
            sys.localStorage.setItem("package_version", version);
            this._listener.onUpdateComplete();

            bundle.loadScene("game", (err, scene) => {
                if (err) {
                    RxUpdateLogger.e("加载场景 game 失败", err);
                } else {
                    RxUpdateLogger.i("加载场景 game 成功", scene);
                    director.loadScene("game", () => {
                        // 升级完成，销毁 updater
                        _RxGlobals.updater = null; 
                        RxUpdateLogger.i("切换场景 game 成功");
                    });
                }
            });
        });
    }
}
