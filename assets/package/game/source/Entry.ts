import { Director, director, Game, game, Texture2D } from "cc";
import { Rx } from "./Rx";
import { EDITOR } from "cc/env";

if (!EDITOR) {
    /**
     * 在游戏场景加载后初始化 Rx 框架
     */
    function onGameSceneLaunched() {
        director.once(Director.EVENT_END_FRAME, function () {
            const scene = director.getScene();
            if (scene && scene.name === "game") {
                director.off(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
                (_RxGlobals.Rx = Rx).initialize(scene);
            }
        });
    }

    /**
     * 监听纹理创建与销毁，统计当前纹理数量
     */
    function onGameRendererInited() {
        game.off(Game.EVENT_RENDERER_INITED, onGameRendererInited);
        Rx.debug.monitorTextures();
    }

    director.on(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
    game.on(Game.EVENT_RENDERER_INITED, onGameRendererInited);
}
