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
        if (sys.isBrowser) {
            if (sys.isMobile) {
                // 移动平台的浏览器不需要彩色
                console.debug = console.debug.bind(console, "[D]");
                console.log = console.log.bind(console, "[L]");
                console.info = console.info.bind(console, "[I]");
                console.warn = console.warn.bind(console, "[W]");
                console.error = console.error.bind(console, "[E]");
            } else {
                // 非移动平台的浏览器开启彩色
                const format = "padding:4px 0px 4px 0px;font-weight:bold;color:black;background-color:"
                console.debug = console.debug.bind(console, "%c D ", format + "rgb(180,180,180);");
                console.log = console.log.bind(console, "%c L ", format + "rgb(120,120,120);");
                console.info = console.info.bind(console, "%c I ", format + "rgb(61,132,247);");
                console.warn = console.warn.bind(console, "%c W ", format + "rgb(234,166,68);");
                console.error = console.error.bind(console, "%c E ", format + "rgb(231,74,97);");
            }
        }

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
        director.loadScene("boot", function () {
            director.once(Director.EVENT_END_FRAME, function () {
                const cs = director.getScene();
                console.log("加载之后", cs);
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
