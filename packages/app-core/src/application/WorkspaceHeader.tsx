import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@wekamb/shared-ui/button";
import { KanbanMark } from "@wekamb/shared-ui/kanban-mark";

type WorkspaceHeaderProps = {
    onLoadExamples: () => void;
};

const WorkspaceHeader = ({ onLoadExamples }: WorkspaceHeaderProps) => (
    <header className="workspace-header">
        <div className="workspace-brand">
            <span className="brand-mark" aria-hidden="true">
                <KanbanMark />
            </span>
            <div>
                <h1>WeKamb</h1>
                <p>Kanban</p>
            </div>
        </div>
        <nav aria-label="Ações do quadro" className="workspace-actions">
            <Button
                type="button"
                variant="ghost"
                aria-label="Adicionar exemplo"
                className="header-action"
                onClick={onLoadExamples}
            >
                <Plus size={13} aria-hidden="true" className="hidden sm:block" />
                <span className="sm:hidden">Exemplo</span>
                <span className="hidden sm:inline">Adicionar exemplo</span>
            </Button>
            <Button variant="ghost" className="header-action" asChild>
                <a
                    href="https://github.com/gumoeska/WeKamb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                    <ArrowUpRight size={13} aria-hidden="true" className="hidden sm:block" />
                    <span className="sr-only"> (abre em nova aba)</span>
                </a>
            </Button>
        </nav>
    </header>
);

export default WorkspaceHeader;
