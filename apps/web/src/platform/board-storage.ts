import { BOARD_STORAGE_KEY, type BoardRepository } from "@wekamb/bridge-contract";
import { isBoardData, type BoardData } from "@wekamb/shared-domain";

type BoardStorage = Pick<Storage, "getItem" | "setItem">;

export function createBoardRepository(storage: BoardStorage): BoardRepository {
    return {
        load() {
            try {
                const stored = storage.getItem(BOARD_STORAGE_KEY);
                let board: unknown;

                if (stored !== null) {
                    const parsed: unknown = JSON.parse(stored);

                    if (
                        typeof parsed !== "object" ||
                        parsed === null ||
                        !("version" in parsed) ||
                        parsed.version !== 1 ||
                        !("board" in parsed)
                    ) {
                        throw new Error("Invalid board document");
                    }

                    board = parsed.board;
                } else {
                    board = {
                        cards: JSON.parse(storage.getItem("cards") ?? "[]"),
                        columns: JSON.parse(storage.getItem("columns") ?? "[]"),
                    };
                }

                if (!isBoardData(board)) {
                    throw new Error("Invalid board data");
                }

                return { board, error: null };
            } catch {
                return {
                    board: { cards: [], columns: [] },
                    error: "Não foi possível carregar o quadro salvo. Os dados anteriores não foram alterados; novas alterações tentarão salvar um novo quadro.",
                };
            }
        },
        save(board: BoardData) {
            try {
                storage.setItem(BOARD_STORAGE_KEY, JSON.stringify({ version: 1, board }));

                return null;
            } catch {
                return "Não foi possível salvar no navegador. Suas alterações estão apenas nesta sessão.";
            }
        },
    };
}
