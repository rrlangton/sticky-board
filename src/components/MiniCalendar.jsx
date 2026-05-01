import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const colorDot = {
  yellow: '#fde68a', pink: '#f9a8d4', blue: '#93c5fd',
  green: '#86efac', orange: '#fdba74', purple: '#c4b5fd'
};

export default function MiniCalendar({ tasks, onDateSelect, selectedDate, onDropOnDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dragOver, setDragOver] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const tasksByDate = {};
  tasks.forEach(t => {
    const d = t.due_date || t.calendar_date;
    if (d) {
      const key = d.split('T')[0];
      if (!tasksByDate[key]) tasksByDate[key] = [];
      tasksByDate[key].push(t);
    }
  });

  const handleDragOver = (e, day) => {
    e.preventDefault();
    setDragOver(format(day, 'yyyy-MM-dd'));
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onDropOnDate) onDropOnDate(taskId, format(day, 'yyyy-MM-dd'));
    setDragOver(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="p-1 rounded-lg hover:bg-secondary transition">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="font-nunito font-bold text-sm text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-1 rounded-lg hover:bg-secondary transition">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[key] || [];
          const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
          const isDragTarget = dragOver === key;

          return (
            <div
              key={key}
              onClick={() => onDateSelect(key)}
              onDragOver={e => handleDragOver(e, day)}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, day)}
              className={`
                relative flex flex-col items-center justify-start p-0.5 rounded-lg cursor-pointer transition min-h-[36px]
                ${!isSameMonth(day, currentMonth) ? 'opacity-30' : ''}
                ${isToday(day) ? 'ring-2 ring-primary/60' : ''}
                ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}
                ${isDragTarget ? 'bg-primary/20 ring-2 ring-primary' : ''}
              `}
            >
              <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                  {dayTasks.slice(0, 3).map((t, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: colorDot[t.color] || colorDot.yellow }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}