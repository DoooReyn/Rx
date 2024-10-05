import { Game, assetManager, director, game, log } from "cc";
import { EDITOR, PREVIEW } from "cc/env";

if (!EDITOR) {
    const scene = "boot";

    game.once(Game.EVENT_ENGINE_INITED, function () {
        log("引擎初始化完成");
    })

    game.once(Game.EVENT_GAME_INITED, function () {
        log("系统初始化完成");

        director.loadScene(scene, function () {
            log(scene, "场景加载完成");
            let version = "";
            if (!PREVIEW) {
                const url = [_RxSystemSettings.res_server, "versions.json"].join("/");
                assetManager.downloader.appendTimeStamp = true;
                assetManager.loadRemote(url,)
            }
            assetManager.loadBundle("game", { version }, function (err, bun) {
                director.loadScene("game", function (err, scene) {
                    console.log('--->', err, scene);
                })
            })
        });
    })
}
