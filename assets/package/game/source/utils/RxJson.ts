import pako from "pako";
import zipson from "zipson";

/**
 * JSON数据压缩和序列化方法
 */
export class RxJson {
    /** 序列化 */
    public static encode(input: any): string {
        return zipson.stringify(input);
    }

    /** 序列化 */
    public static encode2u8(input: any): Uint8Array {
        return pako.deflate(zipson.stringify(input));
    }

    /** 解析 */
    public static decode(input: string): any {
        return zipson.parse(input);
    }

    /** 解析 */
    public static decode2u8(input: Uint8Array): any {
        return zipson.parse(pako.inflate(input, { to: "string" }));
    }
}
