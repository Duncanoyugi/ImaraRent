import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface RowAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  /** Provide `to` for navigation or `onSelect` for a handler, not both. */
  to?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  separated?: boolean;
  /** Hide entirely, e.g. an action this role may not perform. */
  hidden?: boolean;
}

export interface DataTableRowActionsProps {
  actions: RowAction[];
  label?: string;
}

/** The trailing "…" menu on a table row. */
export const DataTableRowActions = ({
  actions,
  label = 'Row actions',
}: DataTableRowActionsProps) => {
  const visible = actions.filter((action) => !action.hidden);
  if (visible.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={label}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {visible.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              {Icon && <Icon className="h-4 w-4" />}
              {action.label}
            </>
          );

          return (
            <div key={action.id}>
              {action.separated && <DropdownMenuSeparator />}
              <DropdownMenuItem
                disabled={action.disabled}
                onClick={action.onSelect}
                asChild={!!action.to}
                className={cn(
                  'flex items-center gap-2',
                  action.destructive && 'text-error-600 focus:text-error-600'
                )}
              >
                {action.to ? (
                  <Link to={action.to} className="flex items-center gap-2">
                    {content}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">{content}</span>
                )}
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DataTableRowActions.displayName = 'DataTableRowActions';
