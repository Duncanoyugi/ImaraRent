import { describe, expect, it } from 'vitest';
import { humanizeEnum } from '@/utils/string-helpers';
import { formatFileSize, validateFile } from '@/utils/file-helpers';

const OPEN_STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS'];

describe('ticket status', () => {
  it('treats completed and closed tickets as not open', () => {
    expect(OPEN_STATUSES).not.toContain('COMPLETED');
    expect(OPEN_STATUSES).not.toContain('CLOSED');
  });

  it('renders priorities and statuses readably', () => {
    expect(humanizeEnum('IN_PROGRESS')).toBe('In progress');
    expect(humanizeEnum('URGENT')).toBe('Urgent');
  });
});

describe('photo attachments', () => {
  const makeFile = (name: string, type: string, sizeBytes: number) => {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: sizeBytes });
    return file;
  };

  it('accepts a reasonable image', () => {
    expect(validateFile(makeFile('leak.jpg', 'image/jpeg', 1_000_000), { accept: ['image/*'] }))
      .toBeNull();
  });

  it('rejects a file over the size limit and says how big it was', () => {
    const error = validateFile(makeFile('huge.jpg', 'image/jpeg', 12 * 1024 * 1024), {
      maxSizeMb: 5,
      accept: ['image/*'],
    });
    expect(error).toContain('12.0 MB');
    expect(error).toContain('5 MB');
  });

  it('rejects an unsupported type', () => {
    const error = validateFile(makeFile('notes.exe', 'application/x-msdownload', 1000), {
      accept: ['image/*'],
    });
    expect(error).toContain('not a supported file type');
  });

  it('formats sizes for display', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});
