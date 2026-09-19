import { describe, expect, it } from 'vitest';
import { percentage, sumBy } from '@/utils/number-helpers';
import { matchesSearch, humanizeEnum, pluralize } from '@/utils/string-helpers';
import { buildPortfolio, buildUnit } from '@/test/mocks/data-mocks';

describe('portfolio maths', () => {
  it('computes occupancy from unit statuses', () => {
    const { units } = buildPortfolio();
    const occupied = units.filter((unit) => unit.status === 'OCCUPIED').length;
    expect(occupied).toBe(3);
    expect(percentage(occupied, units.length, 0)).toBe(75);
  });

  it('sums the rent roll from Decimal strings', () => {
    const { units } = buildPortfolio();
    expect(sumBy(units, (unit) => unit.rentAmount)).toBe(140000);
  });

  it('reports zero occupancy for a property with no units', () => {
    expect(percentage(0, 0, 0)).toBe(0);
  });
});

describe('list filtering', () => {
  it('matches across several fields, case-insensitively', () => {
    const unit = buildUnit({ number: 'A1' });
    expect(matchesSearch('a1', unit.number, 'Riverside Court')).toBe(true);
    expect(matchesSearch('RIVERSIDE', unit.number, 'Riverside Court')).toBe(true);
    expect(matchesSearch('kilimani', unit.number, 'Riverside Court')).toBe(false);
  });

  it('treats an empty search as matching everything', () => {
    expect(matchesSearch('', 'anything')).toBe(true);
    expect(matchesSearch('   ', 'anything')).toBe(true);
  });

  it('ignores null and undefined fields rather than throwing', () => {
    expect(matchesSearch('test', null, undefined, 'test value')).toBe(true);
  });
});

describe('display helpers', () => {
  it('turns API enums into sentence case', () => {
    expect(humanizeEnum('PARTIALLY_PAID')).toBe('Partially paid');
    expect(humanizeEnum('OCCUPIED')).toBe('Occupied');
    expect(humanizeEnum(null)).toBe('');
  });

  it('pluralises counts', () => {
    expect(pluralize(1, 'unit')).toBe('1 unit');
    expect(pluralize(3, 'unit')).toBe('3 units');
  });
});
