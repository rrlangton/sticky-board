import { LogOut, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function TopBar({ user, boardName }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-md border-b border-border/50">
      <div>
        <h1 className="font-nunito font-extrabold text-xl text-foreground">{boardName || 'StickyBoard'}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
            {user?.full_name || user?.email || 'User'}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => base44.auth.logout()}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}