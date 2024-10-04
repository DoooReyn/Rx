import { Game, director, game, log } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
    const scene = "boot";

    game.once(Game.EVENT_ENGINE_INITED, function () {
        log("引擎初始化完成");
    })

    game.once(Game.EVENT_GAME_INITED, function () {
        log("系统初始化完成");

        director.loadScene(scene, function () {
            log(scene, "场景加载完成");
        });
    })
}