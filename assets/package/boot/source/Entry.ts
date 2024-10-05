import { Game, assetManager, director, game } from "cc";
import { EDITOR, PREVIEW } from "cc/env";



if (!EDITOR) {
    const scene = "boot";
    const next_scene = "game";

    game.once(Game.EVENT_ENGINE_INITED, function () {
        console.debug = console.debug.bind(console, "[Rx.D]");
        console.log = console.log.bind(console, "[Rx.L]");
        console.info = console.info.bind(console, "[Rx.I]");
        console.warn = console.warn.bind(console, "[Rx.W]");
        console.error = console.error.bind(console, "[Rx.E]");
        console.log("引擎初始化完成");
    })

    game.once(Game.EVENT_GAME_INITED, function () {
        console.log("系统初始化完成");

        director.loadScene(scene, function () {
            console.log(scene, "场景加载完成");
            let version = "";
            if (!PREVIEW) {
                const url = [_RxSystemSettings.res_server, "versions.json"].join("/");
                assetManager.downloader.appendTimeStamp = true;
                assetManager.loadRemote(url,)
            }
            assetManager.loadBundle(next_scene, { version }, function (err, bun) {
                director.loadScene(next_scene, function (err, scene) {
                    console.log('', err, scene);
                })
            })
        });
    })
}
