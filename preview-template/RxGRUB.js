/**
 * @type {
    env: "dev" | "dist";
    res_server: string;
    platform: string;
    sdk: string;
    log_level: "debug" | "info" | "warn" | "error" | "none";
    upgrage_strategy: "patch" | "minor" | "major" | "suspend";
    internal_version: `${number}.${number}.${number}`;
   }
 */
const _RxSystemSettings = {
  env: "dev",
  res_server: "http://127.0.0.1:7777/resources/",
  platform: "preview",
  sdk: "",
  log_level: "debug",
  upgrade_strategy: "suspend",
  internal_version: "0.0.1",
};

/** 导出 */
const _G = (globalThis || window || self || frames || global || this);
_G._RxGlobals = _G;
_G._RxSystemSettings = _RxSystemSettings;
