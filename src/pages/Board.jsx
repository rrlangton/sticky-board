import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import KanbanColumn from '@/components/KanbanColumn';
import TaskModal from '@/components/TaskModal';
import BoardModal from '@/components/BoardModal';

export default function BoardPage() {
  const qc = useQueryClient();
  const [user, setUser] = useState({ email: 'demo@example.com', full_name: 'Demo User' });
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [taskModal, setTaskModal] = useState({ open: false, task: null, defaultColumn: null });
  const [boardModal, setBoardModal] = useState({ open: false, board: null });
  const [selectedDate, setSelectedDate] = useState(null);

  // No need for auth check anymore

  // Fetch boards
  const { data: boards = [] } = useQuery({
    queryKey: ['boards', user?.email],
    queryFn: () => base44.entities.Board.filter({ owner_email: user.email }, '-created_date'),
    enabled: !!user?.email,
  });

  // Auto-select first board
  useEffect(() => {
    if (boards.length > 0 && !currentBoardId) {
      setCurrentBoardId(boards[0].id);
    }
  }, [boards]);

  const currentBoard = boards.find(b => b.id === currentBoardId);
  const columns = currentBoard?.columns || ['To Do', 'In Progress', 'Done'];

  // Fetch tasks for current board
  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks', currentBoardId],
    queryFn: () => base44.entities.Task.filter({ board_id: currentBoardId }, 'position'),
    enabled: !!currentBoardId,
  });

  // Filter tasks by selected date if any
  const displayedTasks = selectedDate
    ? allTasks.filter(t => (t.due_date || '').startsWith(selectedDate) || (t.calendar_date || '').startsWith(selectedDate))
    : allTasks;

  // Create task
  const createTask = useMutation({
    mutationFn: data => base44.entities.Task.create({
      ...data, board_id: currentBoardId, owner_email: user?.email, position: Date.now()
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', currentBoardId] }); toast.success('Task added!'); }
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', currentBoardId] })
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: id => base44.entities.Task.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', currentBoardId] }); toast.success('Task deleted'); }
  });

  // Create board
  const createBoard = useMutation({
    mutationFn: data => base44.entities.Board.create({ ...data, owner_email: user?.email }),
    onSuccess: (b) => {
      console.log('Board created:', b);
      qc.invalidateQueries({ queryKey: ['boards', user?.email] });
      setCurrentBoardId(b.id);
      toast.success('Board created!');
    },
    onError: (error) => {
      console.error('Board creation failed - Full error:', error);
      console.error('Error message:', error?.message);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.data);
      toast.error(`Failed to create board: ${error?.message || 'Unknown error'}`);
    }
  });

  // Update board
  const updateBoard = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Board.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['boards', user?.email] })
  });

  // Delete board
  const deleteBoard = useMutation({
    mutationFn: id => base44.entities.Board.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['boards', user?.email] });
      setCurrentBoardId(null);
      toast.success('Board deleted');
    }
  });

  const handleTaskSave = (form) => {
    if (taskModal.task) {
      updateTask.mutate({ id: taskModal.task.id, data: form });
    } else {
      createTask.mutate(form);
    }
  };

  const handleBoardSave = (form) => {
    console.log('Saving board:', form);
    if (boardModal.board) {
      console.log('Updating existing board:', boardModal.board.id);
      updateBoard.mutate({ id: boardModal.board.id, data: form });
    } else {
      console.log('Creating new board');
      createBoard.mutate(form);
    }
    setBoardModal({ open: false, board: null });
  };

  const handleDropOnColumn = (taskId, column) => {
    updateTask.mutate({ id: taskId, data: { column } });
  };

  const handleDropOnDate = (taskId, date) => {
    updateTask.mutate({ id: taskId, data: { calendar_date: date, due_date: date } });
    toast.success('Task scheduled!');
  };

  return (
    <div className="min-h-screen flex flex-col font-nunito" style={{
      background: 'linear-gradient(135deg, hsl(220,60%,96%) 0%, hsl(252,55%,95%) 50%, hsl(336,55%,96%) 100%)'
    }}>
      <TopBar user={user} boardName={currentBoard?.name} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          boards={boards}
          currentBoardId={currentBoardId}
          onSelectBoard={setCurrentBoardId}
          onNewBoard={() => setBoardModal({ open: true, board: null })}
          onEditBoard={board => setBoardModal({ open: true, board })}
          onDeleteBoard={id => deleteBoard.mutate(id)}
          tasks={allTasks}
          selectedDate={selectedDate}
          onDateSelect={d => setSelectedDate(prev => prev === d ? null : d)}
          onDropOnDate={handleDropOnDate}
        />

        {/* Main Kanban */}
        <main className="flex-1 overflow-x-auto p-4">
          {!currentBoardId ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-muted-foreground text-lg font-semibold">No board selected</p>
              <Button onClick={() => setBoardModal({ open: true, board: null })}>
                <Plus className="w-4 h-4 mr-2" /> Create your first board
              </Button>
            </div>
          ) : (
            <div className="flex gap-5 h-full items-start pb-6">
              {columns.map(col => (
                <div key={col} className="flex-1 min-w-[220px]">
                  <KanbanColumn
                    column={col}
                    tasks={displayedTasks.filter(t => t.column === col).sort((a, b) => (a.position || 0) - (b.position || 0))}
                    onAddTask={col => setTaskModal({ open: true, task: null, defaultColumn: col })}
                    onEditTask={task => setTaskModal({ open: true, task, defaultColumn: task.column })}
                    onDeleteTask={id => deleteTask.mutate(id)}
                    onDrop={handleDropOnColumn}
                  />
                </div>
              ))}

              <Button
                variant="outline"
                className="mt-0 self-start shrink-0 bg-white/60 border-dashed text-muted-foreground hover:bg-white/80"
                onClick={() => setBoardModal({ open: true, board: currentBoard })}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Column
              </Button>
            </div>
          )}
        </main>
      </div>

      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false, task: null, defaultColumn: null })}
        onSave={handleTaskSave}
        task={taskModal.task}
        columns={columns}
        defaultColumn={taskModal.defaultColumn}
      />

      <BoardModal
        open={boardModal.open}
        onClose={() => setBoardModal({ open: false, board: null })}
        onSave={handleBoardSave}
        board={boardModal.board}
      />
    </div>
  );
}