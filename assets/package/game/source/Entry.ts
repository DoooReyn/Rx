import { Director, director } from "cc";
import { EDITOR } from "cc/env";

if (!EDITOR) {
    function onGameSceneLaunched() {
        director.once(Director.EVENT_END_FRAME, function () {
            const scene = director.getScene();
            if (scene && scene.name === "game") {
                console.log("主场景加载完成", scene);
                director.off(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
            }
        });
    }

    director.on(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
}
