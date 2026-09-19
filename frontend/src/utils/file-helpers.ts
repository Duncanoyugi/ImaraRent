export const BYTES_PER_MB = 1024 * 1024;

export const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exp;
  return `${size.toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
};

export const fileExtension = (name: string): string =>
  name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';

export const isImage = (file: File): boolean => file.type.startsWith('image/');

export interface FileValidationRules {
  maxSizeMb?: number;
  accept?: string[];
}

/** Returns an error message, or null when the file is acceptable. */
export const validateFile = (
  file: File,
  { maxSizeMb = 5, accept }: FileValidationRules = {}
): string | null => {
  if (file.size > maxSizeMb * BYTES_PER_MB) {
    return `${file.name} is ${formatFileSize(file.size)} — the limit is ${maxSizeMb} MB`;
  }
  if (accept && accept.length > 0) {
    const ext = fileExtension(file.name);
    const ok = accept.some((rule) =>
      rule.startsWith('.') ? rule.slice(1).toLowerCase() === ext : file.type.startsWith(rule.replace('/*', ''))
    );
    if (!ok) return `${file.name} is not a supported file type`;
  }
  return null;
};

export const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

/** Triggers a browser download for a blob or data URL. */
export const downloadBlob = (blob: Blob | string, filename: string): void => {
  const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (typeof blob !== 'string') URL.revokeObjectURL(url);
};

/** Serialises rows to CSV and downloads them — powers every report export. */
export const downloadCsv = (
  filename: string,
  columns: Array<{ key: string; label: string }>,
  rows: Array<Record<string, unknown>>
): void => {
  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const header = columns.map((c) => escape(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(',')).join('\n');
  const csv = `${header}\n${body}`;
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
};

export const downloadJson = (filename: string, data: unknown): void => {
  downloadBlob(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    filename
  );
};
