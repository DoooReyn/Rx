import { RxDebugUtil } from "./utils/RxDebugUtil";
import { RxRoot } from "./view/RxRoot";

/**
 * Rx 框架
 */
export class Rx {
    public static readonly root = new RxRoot();
    public static readonly debug: RxDebugUtil = new RxDebugUtil(true);
    public static get logger() {
        return _RxGlobals.logger;
    }
}
