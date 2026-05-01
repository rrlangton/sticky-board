import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask, onDrop }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('taskId_board', task.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onDrop(taskId, column);
    setDragOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col min-w-[220px] w-full transition-all duration-200 ${dragOver ? 'opacity-90' : ''}`}
    >
      {/* Column header */}
      <div className={`
        flex items-center justify-between mb-3 px-3 py-2 rounded-xl font-nunito
        bg-white/70 backdrop-blur border border-border shadow-sm
        ${dragOver ? 'ring-2 ring-primary/50' : ''}
      `}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">{column}</span>
          <span className="text-xs bg-secondary text-muted-foreground rounded-full px-2 py-0.5 font-semibold">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column)}
          className="p-1 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 flex-1 min-h-[120px]">
        {tasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={e => handleDragStart(e, task)}
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
        {dragOver && tasks.length === 0 && (
          <div className="border-2 border-dashed border-primary/40 rounded-xl h-20 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Drop here</span>
          </div>
        )}
      </div>
    </div>
  );
}