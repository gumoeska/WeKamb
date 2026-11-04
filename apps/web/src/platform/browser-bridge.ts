import type { WekambBridge } from "@wekamb/bridge-contract";
import { createBoardRepository } from "./board-storage";

export function createBrowserBridge(): WekambBridge {
    return {
        board: createBoardRepository({
            getItem: (key) => window.localStorage.getItem(key),
            setItem: (key, value) => window.localStorage.setItem(key, value),
        }),
        createId: () => window.crypto.randomUUID(),
    };
}
