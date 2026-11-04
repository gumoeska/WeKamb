import type { WekambBridge } from "@wekamb/bridge-contract";
import KanbanBoard from "../kanban/components/KanbanBoard";
import { useBoard } from "../stores/useBoard";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";

type WekambAppProps = {
    bridge: WekambBridge;
};

const WekambApp = ({ bridge }: WekambAppProps) => {
    const controller = useBoard(bridge);

    return (
        <div className="app-shell">
            <a href="#workspace" className="skip-link">
                Ir para o quadro
            </a>
            <WorkspaceHeader onLoadExamples={controller.loadExamples} />
            <main id="workspace" className="workspace-main">
                {controller.storageError && (
                    <p role="alert" className="storage-alert">
                        {controller.storageError}
                    </p>
                )}
                <section aria-label="Quadro de tarefas" className="min-w-0">
                    <KanbanBoard controller={controller} />
                </section>
            </main>
            <WorkspaceFooter />
        </div>
    );
};

export default WekambApp;
