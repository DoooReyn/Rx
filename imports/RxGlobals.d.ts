declare global {
    interface Window {
        RxSettings: {
            mode: "dev" | "dist";
            res_server: string;
        };
    }
}