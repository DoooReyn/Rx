import { sys } from "cc";

/**
 * 时间标记
 */
export class RxTimeMark {
    /** 开始时间点 */
    private _start: number;
    /** 结束时间点 */
    private _ended: number;
    /** 耗时 */
    private _elapsed: number;

    /**
     * @param _tag 标识
     */
    public constructor(private _tag: string) {
        this._start = this._ended = this._elapsed = 0;
    }

    /** 标识 */
    public get tag() {
        return this._tag;
    }

    /** 当前时间点 */
    public get now() {
        return performance ? performance.now() : sys.now();
    }

    /** 耗时 */
    public get elapsed() {
        return this._elapsed;
    }

    /** 开始时间点 */
    public get startAt() {
        return this._start;
    }

    /** 结束时间点 */
    public get endAt() {
        return this._ended;
    }

    /** 记录开始时间点 */
    public start() {
        this._start = this.now;
    }

    /** 记录结束时间点 */
    public end() {
        if (isNaN(this._start)) return;
        this._ended = this.now;
        this._elapsed = this._ended - this._start;
    }
}
