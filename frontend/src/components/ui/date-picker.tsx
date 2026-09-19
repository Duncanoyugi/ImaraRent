import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { shortDate, toInputDate } from '@/utils/date-formatter';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Days rendered in the grid, padded so the month starts on Monday. */
const monthGrid = (cursor: Date): Array<Date | null> => {
  const first = startOfMonth(cursor);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  // getDay(): 0=Sun. Shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;
  return [
    ...Array.from<null>({ length: lead }).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];
};

export interface DatePickerProps {
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-invalid'?: boolean;
}

/**
 * Calendar-in-a-popover. Emits `yyyy-MM-dd`, which is what both the date
 * inputs and the API expect, so it drops straight into react-hook-form.
 */
export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  min,
  max,
  disabled,
  id,
  className,
  ...aria
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const selected = value ? new Date(`${value}T12:00:00`) : null;
  const [cursor, setCursor] = React.useState(() => startOfMonth(selected ?? new Date()));

  React.useEffect(() => {
    if (selected) setCursor(startOfMonth(selected));
    // Only re-sync when the external value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const minDate = min ? new Date(`${min}T00:00:00`) : null;
  const maxDate = max ? new Date(`${max}T23:59:59`) : null;
  const isDisabled = (day: Date) =>
    (minDate !== null && day < minDate) || (maxDate !== null && day > maxDate);

  const today = new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={aria['aria-invalid']}
          className={cn(
            'h-10 w-full justify-start gap-2 border-neutral-200 bg-white px-3 font-normal',
            !value && 'text-neutral-400',
            aria['aria-invalid'] && 'border-error-500',
            'dark:border-neutral-700 dark:bg-neutral-900',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-neutral-400" />
          {value ? shortDate(selected) : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Previous month"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {cursor.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Next month"
            onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-0.5" role="grid">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="pb-1 text-center text-[11px] font-medium text-neutral-400"
              aria-hidden="true"
            >
              {day}
            </span>
          ))}

          {monthGrid(cursor).map((day, index) =>
            day === null ? (
              <span key={`pad-${index}`} />
            ) : (
              <button
                key={day.toISOString()}
                type="button"
                disabled={isDisabled(day)}
                aria-label={shortDate(day)}
                aria-selected={selected ? isSameDay(day, selected) : false}
                onClick={() => {
                  onChange(toInputDate(day));
                  setOpen(false);
                }}
                className={cn(
                  'h-8 w-8 rounded-lg text-sm tabular transition-colors',
                  'hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  'disabled:pointer-events-none disabled:opacity-30',
                  'dark:hover:bg-neutral-800',
                  isSameDay(day, today) &&
                    'font-semibold text-brand-600 ring-1 ring-inset ring-brand-300 dark:text-brand-400',
                  selected &&
                    isSameDay(day, selected) &&
                    'bg-brand-600 font-semibold text-white ring-0 hover:bg-brand-700 dark:text-white'
                )}
              >
                {day.getDate()}
              </button>
            )
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2 dark:border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              onChange(toInputDate(new Date()));
              setOpen(false);
            }}
          >
            Today
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-neutral-500"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = 'DatePicker';
