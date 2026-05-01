import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];
const colorBg = {
  yellow: '#fde68a', pink: '#f9a8d4', blue: '#93c5fd',
  green: '#86efac', orange: '#fdba74', purple: '#c4b5fd'
};

export default function TaskModal({ open, onClose, onSave, task, columns, defaultColumn }) {
  const [form, setForm] = useState({
    title: '', description: '', column: defaultColumn || columns?.[0] || 'To Do',
    color: 'yellow', priority: 'medium', due_date: ''
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        column: task.column || defaultColumn || columns?.[0] || 'To Do',
        color: task.color || 'yellow',
        priority: task.priority || 'medium',
        due_date: task.due_date || '',
      });
    } else {
      setForm({
        title: '', description: '',
        column: defaultColumn || columns?.[0] || 'To Do',
        color: 'yellow', priority: 'medium', due_date: ''
      });
    }
  }, [task, open, defaultColumn]);

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-nunito">
        <DialogHeader>
          <DialogTitle className="font-nunito font-bold text-lg">
            {task ? 'Edit Task' : 'New Task'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What needs to be done?"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Add notes..."
              className="mt-1 h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Column</Label>
              <Select value={form.column} onValueChange={v => setForm(f => ({ ...f, column: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(columns || ['To Do', 'In Progress', 'Done']).map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Note Color</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    form.color === c ? 'border-gray-700 scale-125' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ background: colorBg[c] }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.title.trim()}>
            {task ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}