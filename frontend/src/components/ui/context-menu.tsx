import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Right-click menu for table rows.
 *
 * Reuses the dropdown primitive — which already handles focus trapping,
 * typeahead and collision detection — and drives it from a hidden anchor
 * positioned at the pointer, so there is one menu implementation, not two.
 */

export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
  /** Renders a divider above this entry. */
  separated?: boolean;
}

export interface ContextMenuProps {
  actions: ContextMenuAction[];
  label?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ContextMenu = ({
  actions,
  label,
  children,
  className,
  disabled = false,
}: ContextMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState({ x: 0, y: 0 });

  const onContextMenu = (event: React.MouseEvent) => {
    if (disabled || actions.length === 0) return;
    event.preventDefault();
    setPoint({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };

  return (
    <div onContextMenu={onContextMenu} className={cn('contents', className)}>
      {children}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <span
            aria-hidden="true"
            style={{ position: 'fixed', left: point.x, top: point.y, width: 1, height: 1 }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <React.Fragment key={action.id}>
                {action.separated && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={action.disabled}
                  onClick={action.onSelect}
                  className={cn(
                    'flex items-center gap-2',
                    action.destructive && 'text-error-600 focus:text-error-600'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {action.label}
                </DropdownMenuItem>
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

ContextMenu.displayName = 'ContextMenu';
