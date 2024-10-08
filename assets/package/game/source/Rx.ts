import { RxDebugUtil } from "./utils/RxDebugUtil";
import { RxRoot } from "./view/RxRoot";

/**
 * Rx 框架
 */
export namespace Rx {
    export const root: RxRoot = new RxRoot();
    export const debug: RxDebugUtil = new RxDebugUtil();
    export const logger = console;
}
