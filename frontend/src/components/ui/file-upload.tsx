import * as React from 'react';
import { FileText, Image as ImageIcon, Paperclip, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize, isImage, validateFile } from '@/utils/file-helpers';

export interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  /** Extensions (`.pdf`) or mime prefixes (`image/*`) used for validation. */
  acceptRules?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
  disabled?: boolean;
  hint?: string;
  className?: string;
  onError?: (message: string) => void;
}

/**
 * Drag-and-drop file field with thumbnail previews.
 *
 * Holds `File` objects rather than uploading immediately — the parent decides
 * when to send them (maintenance photos post after the ticket is created).
 */
export const FileUpload = ({
  value,
  onChange,
  accept = 'image/*',
  acceptRules = ['image/*'],
  multiple = true,
  maxFiles = 5,
  maxSizeMb = 5,
  disabled = false,
  hint,
  className,
  onError,
}: FileUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [previews, setPreviews] = React.useState<Record<string, string>>({});

  // Object URLs must be revoked or the tab leaks memory on long sessions.
  React.useEffect(() => {
    const next: Record<string, string> = {};
    value.forEach((file) => {
      if (isImage(file)) next[`${file.name}-${file.size}`] = URL.createObjectURL(file);
    });
    setPreviews(next);
    return () => Object.values(next).forEach(URL.revokeObjectURL);
  }, [value]);

  const accept_ = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;

    const room = maxFiles - value.length;
    if (room <= 0) {
      onError?.(`You can attach at most ${maxFiles} file${maxFiles === 1 ? '' : 's'}`);
      return;
    }

    const accepted: File[] = [];
    Array.from(incoming)
      .slice(0, room)
      .forEach((file) => {
        const error = validateFile(file, { maxSizeMb, accept: acceptRules });
        if (error) onError?.(error);
        else accepted.push(file);
      });

    if (accepted.length > 0) onChange(multiple ? [...value, ...accepted] : accepted.slice(0, 1));
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) accept_(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          dragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-neutral-300 hover:border-brand-400 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <Upload className="h-6 w-6 text-neutral-400" />
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Drag files here, or click to choose
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {hint ?? `Up to ${maxFiles} file${maxFiles === 1 ? '' : 's'}, ${maxSizeMb} MB each`}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            accept_(e.target.files);
            // Reset so choosing the same file twice still fires onChange.
            e.target.value = '';
          }}
        />
      </div>

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {value.map((file, index) => {
            const key = `${file.name}-${file.size}`;
            const preview = previews[key];
            return (
              <li
                key={key}
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
                    {isImage(file) ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : file.type === 'application/pdf' ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {file.name}
                  </span>
                  <span className="block text-[11px] text-neutral-500">
                    {formatFileSize(file.size)}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${file.name}`}
                  className="shrink-0 rounded p-1 text-neutral-400 transition hover:bg-error-50 hover:text-error-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
