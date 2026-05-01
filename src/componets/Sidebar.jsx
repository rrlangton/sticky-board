import { useState } from 'react';
import { Plus, ChevronDown, Trash2, Pencil, LayoutDashboard } from 'lucide-react';
import MiniCalendar from './MiniCalendar';
import { Button } from '@/components/ui/button';

export default function Sidebar({
  boards, currentBoardId, onSelectBoard, onNewBoard, onEditBoard, onDeleteBoard,
  tasks, selectedDate, onDateSelect, onDropOnDate
}) {
  const [boardMenuOpen, setBoardMenuOpen] = useState(false);
  const currentBoard = boards.find(b => b.id === currentBoardId);

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-4 p-4">
      {/* App branding */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <span className="font-nunito font-800 text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          StickyBoard
        </span>
      </div>

      {/* Calendar */}
      <MiniCalendar
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onDropOnDate={onDropOnDate}
      />

      {/* Board selector */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-border p-3">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">My Boards</p>

        <div className="relative">
          <button
            onClick={() => setBoardMenuOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition font-nunito font-semibold text-sm text-foreground"
          >
            <span className="truncate">{currentBoard?.name || 'Select a board'}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${boardMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {boardMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-border z-50 overflow-hidden">
              {boards.map(board => (
                <div
                  key={board.id}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-secondary cursor-pointer transition group ${board.id === currentBoardId ? 'bg-primary/10' : ''}`}
                  onClick={() => { onSelectBoard(board.id); setBoardMenuOpen(false); }}
                >
                  <span className="text-sm font-medium truncate">{board.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={e => { e.stopPropagation(); onEditBoard(board); setBoardMenuOpen(false); }}
                      className="p-0.5 rounded hover:bg-primary/10">
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); onDeleteBoard(board.id); setBoardMenuOpen(false); }}
                      className="p-0.5 rounded hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
              {boards.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">No boards yet</p>
              )}
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onNewBoard}
          className="w-full mt-2 text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> New Board
        </Button>
      </div>
    </div>
  );
}