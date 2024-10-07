import { Director, director } from "cc";
import { Rx } from "./Rx";
import { EDITOR } from "cc/env";

if (!EDITOR) {
    function onGameSceneLaunched() {
        director.once(Director.EVENT_END_FRAME, function () {
            const scene = director.getScene();
            if (scene && scene.name === "game") {
                director.off(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
                Rx.root.initialize(scene);
            }
        });
    }

    director.on(Director.EVENT_AFTER_SCENE_LAUNCH, onGameSceneLaunched);
}
