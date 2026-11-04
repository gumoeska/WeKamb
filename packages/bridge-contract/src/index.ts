import type { BoardData } from "@wekamb/shared-domain";

export const BOARD_STORAGE_KEY = "wekamb:board:v1";

export type BoardLoadResult = {
    board: BoardData;
    error: string | null;
};

export interface BoardRepository {
    load(): BoardLoadResult;
    save(board: BoardData): string | null;
}

export interface WekambBridge {
    board: BoardRepository;
    createId(): string;
}
