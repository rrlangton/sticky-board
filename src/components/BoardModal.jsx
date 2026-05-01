import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

export default function BoardModal({ open, onClose, onSave, board }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState(['To Do', 'In Progress', 'Done']);
  const [newCol, setNewCol] = useState('');

  useEffect(() => {
    if (board) {
      setName(board.name || '');
      setDescription(board.description || '');
      setColumns(board.columns || ['To Do', 'In Progress', 'Done']);
    } else {
      setName(''); setDescription('');
      setColumns(['To Do', 'In Progress', 'Done']);
    }
    setNewCol('');
  }, [board, open]);

  const addColumn = () => {
    if (!newCol.trim()) return;
    setColumns(c => [...c, newCol.trim()]);
    setNewCol('');
  };

  const removeColumn = (idx) => setColumns(c => c.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), columns });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-nunito">
        <DialogHeader>
          <DialogTitle className="font-nunito font-bold">
            {board ? 'Edit Board' : 'New Board'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Board Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Work Tasks" className="mt-1" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" className="mt-1" />
          </div>
          <div>
            <Label>Columns</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {columns.map((col, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                  {col}
                  <button onClick={() => removeColumn(idx)} className="text-muted-foreground hover:text-destructive transition">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCol}
                onChange={e => setNewCol(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addColumn()}
                placeholder="Add column..."
                className="text-sm"
              />
              <Button size="sm" variant="outline" onClick={addColumn}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {board ? 'Save' : 'Create Board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}