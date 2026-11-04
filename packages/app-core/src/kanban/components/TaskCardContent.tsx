import { FileText, GripVertical } from "lucide-react";

const TaskCardContent = ({ title }: { title: string }) => (
    <div className="kanban-task-content">
        <div className="task-caption">
            <FileText size={12} strokeWidth={1.5} aria-hidden="true" />
            <span>Tarefa</span>
            <GripVertical className="task-grip" size={15} aria-hidden="true" />
        </div>
        <p className="task-title">{title}</p>
    </div>
);

export default TaskCardContent;
