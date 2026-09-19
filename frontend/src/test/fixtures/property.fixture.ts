import type { Property } from '@/types/property.types';
import type { Unit } from '@/types/unit.types';

export const buildProperty = (overrides: Partial<Property> = {}): Property =>
  ({
    id: 'property-1',
    name: 'Riverside Court',
    address: 'Riverside Drive',
    city: 'Nairobi',
    county: 'Nairobi',
    postalCode: '00100',
    description: 'Twelve-unit block off Riverside Drive.',
    organizationId: 'org-1',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
    ...overrides,
  }) as Property;

export const buildUnit = (overrides: Partial<Unit> = {}): Unit =>
  ({
    id: 'unit-1',
    number: 'A1',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 850,
    // Prisma serialises Decimal columns as strings — fixtures match the wire
    // format so tests exercise the same coercion production does.
    rentAmount: '35000.00',
    depositAmount: '35000.00',
    status: 'OCCUPIED',
    propertyId: 'property-1',
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-02-01T08:00:00.000Z',
    ...overrides,
  }) as unknown as Unit;
