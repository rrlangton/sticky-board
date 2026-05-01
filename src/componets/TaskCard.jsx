import { useState } from 'react';
import { Pencil, Trash2, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';

const colorMap = {
  yellow: 'note-yellow note-yellow-border',
  pink: 'note-pink note-pink-border',
  blue: 'note-blue note-blue-border',
  green: 'note-green note-green-border',
  orange: 'note-orange note-orange-border',
  purple: 'note-purple note-purple-border',
};

const priorityStyles = {
  high: 'bg-red-500 text-white',
  medium: 'bg-amber-400 text-white',
  low: 'bg-emerald-400 text-white',
};

export default function TaskCard({ task, onEdit, onDelete, dragHandleProps = {}, isDragging = false }) {
  const [hovered, setHovered] = useState(false);
  const colorClass = colorMap[task.color] || colorMap.yellow;

  return (
    <div
      {...dragHandleProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative rounded-lg border-2 p-3 cursor-grab active:cursor-grabbing
        transition-all duration-200 font-nunito
        ${colorClass}
        ${isDragging ? 'shadow-note-hover rotate-2 scale-105' : 'shadow-note hover:shadow-note-hover hover:-translate-y-0.5'}
      `}
      style={{ minHeight: 90 }}
    >
      {/* Pin dot */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60 border border-white/80 shadow-sm" />

      <div className="mt-3">
        <p className="font-caveat text-lg font-semibold leading-tight text-gray-800 break-words">{task.title}</p>

        {task.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-nunito">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
          {task.priority && (
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          )}
          {task.due_date && (
            <span className="flex items-center gap-0.5 text-[10px] text-gray-600 font-medium">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.due_date), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      {hovered && (
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1 rounded bg-white/70 hover:bg-white shadow-sm transition"
          >
            <Pencil className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1 rounded bg-white/70 hover:bg-red-100 shadow-sm transition"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}