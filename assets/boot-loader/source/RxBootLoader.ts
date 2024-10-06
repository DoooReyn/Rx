import { Director, Game, JsonAsset, VERSION, assetManager, director, game, sys } from "cc";
import { RxBootScene } from "./RxBootScene";
import { RxUpdater } from "./update/RxUpdater";
import { EDITOR, PREVIEW } from "cc/env";
import { RxLogger } from "./RxBootLogger";

type VERSION = `${number}.${number}.${number}`;
type VERSIONS = Array<[VERSION, string, string]>;

// class RxUpdater {
//     private readonly _current_version: string;
//     private _versions: { latest: VERSION; versions: VERSIONS };

//     constructor() {
//         let ver_local = sys.localStorage.getItem("RxVersions");
//         ver_local ??= _RxSystemSettings.package_version;
//         sys.localStorage.setItem("RxVersions", ver_local);
//         this._current_version = ver_local;
//     }

//     public check_update() {
//         const that = this;
//         const url = [_RxSystemSettings.res_server, "versions.json"].join("/");
//         assetManager.downloader.appendTimeStamp = true;
//         assetManager.loadRemote(url, { ext: ".json" }, function (err, res: JsonAsset) {
//             if (err) {
//                 console.error(err);
//             } else {
//                 // @ts-ignore
//                 that._versions = res.json;
//                 that.apply_update();
//             }
//         });
//     }

//     private apply_update() {
//         console.debug("版本信息", this._versions);

//         const scene_boot = "boot";
//         const scene_game = "game";
//         director.loadScene(scene_boot, function () {
//             console.log(scene_boot, "场景加载完成");
//             let version = "";
//             if (_RxSystemSettings.check_update) {
//             }
//             assetManager.loadBundle(scene_game, { version }, function (err, bun) {
//                 director.loadScene(scene_game, function (err, scene) {
//                     console.log(scene_game, "场景加载完成");
//                 });
//             });
//         });
//     }

//     public get current() {
//         return this._current_version;
//     }

//     public get latest() {
//         return this._versions["boot"];
//     }
// }

class RxBootLoader {
    public static start() {
        // 引擎初始化
        game.once(Game.EVENT_ENGINE_INITED, function () {
            RxBootLoader.onEngineInited();
        });

        // 系统初始化
        game.once(Game.EVENT_GAME_INITED, function () {
            RxBootLoader.onGameInited();
        });
    }

    private static onEngineInited() {
        RxLogger.d("引擎初始化完成");
    }

    private static onGameInited() {
        RxLogger.d("系统初始化完成");
        director.loadScene("boot", function () {
            director.once(Director.EVENT_END_FRAME, function () {
                const cs = director.getScene();
                RxBootScene.inst.initialize(cs);
                RxUpdater.inst.start();
            });
        });
    }
}

/**
 * 只会有两个场景
 * - 热更场景
 * - 游戏场景
 */

!EDITOR && RxBootLoader.start();
