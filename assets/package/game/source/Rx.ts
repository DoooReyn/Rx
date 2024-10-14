import { Scene } from "cc";
import { RxDebugUtil } from "./utils/RxDebugUtil";
import { RxLogger } from "./utils/RxLogger";
import { RxRoot } from "./view/RxRoot";

/**
 * Rx 框架
 */
export class Rx {
    public static readonly debug = new RxDebugUtil();
    public static readonly log = new RxLogger();
    public static readonly root = new RxRoot();
    public static initialize(scene: Scene) {
        this.log.enabled = _RxSystemSettings.log_level != "none";
        this.debug.verbose = _RxSystemSettings.show_stats;
        this.root.initialize(scene);
    }
}
