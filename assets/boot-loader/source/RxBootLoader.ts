import { Director, Game, JsonAsset, VERSION, assetManager, director, game, sys } from "cc";
import { RxBootScene } from "./RxBootScene";
import { RxUpdater } from "./update/RxUpdater";
import { EDITOR, PREVIEW } from "cc/env";

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
        // log 代理
        console.debug = console.debug.bind(console, "%c [Rx.D] ", "background-color:rgb(121,121,121);color:white;");
        console.log = console.log.bind(console, "%c [Rx.L] ", "background-color:rgb(52,52,52);color:white;");
        console.info = console.info.bind(console, "%c [Rx.I] ", "background-color:rgb(61,132,247);color:white;");
        console.warn = console.warn.bind(console, "%c [Rx.W] ", "background-color:rgb(234,166,68);color:white;");
        console.error = console.error.bind(console, "%c [Rx.E] ", "background-color:rgb(231,74,97);color:white;");

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
        console.log("引擎初始化完成");
    }

    private static onGameInited() {
        console.log("系统初始化完成");
        director.loadScene("boot", function (err, scene) {
            director.once(Director.EVENT_END_FRAME, function () {
                // const cs = director.getScene();
                const cs = scene;
                console.log("加载之后", cs);
                RxBootScene.inst.initialize(cs);
                RxUpdater.inst.start();
                console.log("启动场景加载完成", RxBootScene.inst, cs);
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
