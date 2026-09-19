import { describe, expect, it } from 'vitest';
import { decimal, percentage, sumBy } from '@/utils/number-helpers';
import { humanizeEnum } from '@/utils/string-helpers';
import { buildUnit } from '@/test/fixtures/property.fixture';

const STATUSES = ['VACANT', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'] as const;

describe('unit status', () => {
  it('renders every status the API can return', () => {
    STATUSES.forEach((status) => {
      expect(humanizeEnum(status)).not.toBe('');
    });
    expect(humanizeEnum('MAINTENANCE')).toBe('Maintenance');
  });

  it('counts only occupied units toward occupancy', () => {
    const units = STATUSES.map((status, index) =>
      buildUnit({ id: `unit-${index}`, status })
    );
    const occupied = units.filter((unit) => unit.status === 'OCCUPIED').length;
    expect(occupied).toBe(1);
    expect(percentage(occupied, units.length, 0)).toBe(25);
  });
});

describe('unit rent', () => {
  it('parses the Decimal string the API sends', () => {
    expect(decimal(buildUnit({ rentAmount: '42500.50' as never }).rentAmount)).toBe(42500.5);
  });

  it('sums potential rent across units', () => {
    const units = [
      buildUnit({ id: 'a', rentAmount: '10000.00' as never }),
      buildUnit({ id: 'b', rentAmount: '15000.00' as never }),
    ];
    expect(sumBy(units, (unit) => unit.rentAmount)).toBe(25000);
  });

  it('treats a missing rent as zero rather than NaN', () => {
    expect(sumBy([buildUnit({ rentAmount: null as never })], (u) => u.rentAmount)).toBe(0);
  });
});
