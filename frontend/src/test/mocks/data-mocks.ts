export { buildUser, buildOwner, buildManager, buildTenant } from '../fixtures/user.fixture';
export { buildProperty, buildUnit } from '../fixtures/property.fixture';
export { buildInvoice, buildOverdueInvoice, buildPayment } from '../fixtures/invoice.fixture';

import { buildProperty, buildUnit } from '../fixtures/property.fixture';
import { buildInvoice } from '../fixtures/invoice.fixture';

/** A small portfolio: one property, four units, three of them let. */
export const buildPortfolio = () => {
  const property = buildProperty();
  const units = [
    buildUnit({ id: 'unit-1', number: 'A1', status: 'OCCUPIED' }),
    buildUnit({ id: 'unit-2', number: 'A2', status: 'OCCUPIED' }),
    buildUnit({ id: 'unit-3', number: 'B1', status: 'VACANT' }),
    buildUnit({ id: 'unit-4', number: 'B2', status: 'OCCUPIED' }),
  ];
  const invoices = [
    buildInvoice({ id: 'invoice-1', status: 'PAID', paidAmount: 35000, balance: 0 }),
    buildInvoice({ id: 'invoice-2', status: 'PENDING' }),
    buildInvoice({ id: 'invoice-3', status: 'OVERDUE' }),
  ];
  return { property, units, invoices };
};
