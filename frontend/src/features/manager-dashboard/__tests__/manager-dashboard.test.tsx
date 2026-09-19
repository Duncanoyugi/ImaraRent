import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/render-with-providers';
import { ManagerStatCards } from '../components/manager-stat-cards';
import { ManagerTaskList } from '../components/manager-task-list';
import { ManagerVacantUnits } from '../components/manager-vacant-units';
import type { ManagerStats, ManagerTask } from '../types/manager-dashboardtypes';

const stats: ManagerStats = {
  assignedProperties: 3,
  totalUnits: 24,
  vacantUnits: 4,
  occupiedUnits: 20,
  occupancyRate: 83,
  activeTenants: 20,
  openTickets: 5,
  urgentTickets: 2,
  duePayments: 6,
  overdueAmount: 82_000,
};

beforeEach(() => vi.clearAllMocks());

describe('ManagerStatCards', () => {
  it('shows the headline figures', () => {
    renderWithProviders(<ManagerStatCards stats={stats} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('83%')).toBeInTheDocument();
    expect(screen.getByText('Open tickets')).toBeInTheDocument();
  });

  it('calls out urgent tickets when there are some', () => {
    renderWithProviders(<ManagerStatCards stats={stats} />);
    expect(screen.getByText(/2 need attention/i)).toBeInTheDocument();
  });

  it('says so plainly when nothing is urgent', () => {
    renderWithProviders(
      <ManagerStatCards stats={{ ...stats, urgentTickets: 0, overdueAmount: 0 }} />
    );
    expect(screen.getByText(/nothing urgent/i)).toBeInTheDocument();
    expect(screen.getByText(/nothing overdue/i)).toBeInTheDocument();
  });

  it('renders skeletons instead of zeros while loading', () => {
    renderWithProviders(<ManagerStatCards stats={undefined} isLoading />);
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });
});

describe('ManagerTaskList', () => {
  const tasks: ManagerTask[] = [
    {
      id: 'ticket-1',
      kind: 'ticket',
      title: 'Burst pipe in A1',
      detail: 'Unit A1 · Riverside Court',
      urgency: 'urgent',
      href: '/maintenance/ticket-1',
    },
    {
      id: 'invoice-1',
      kind: 'invoice',
      title: 'INV-2026-0003 is overdue',
      detail: 'Grace Njeri · 12 days late',
      urgency: 'high',
      href: '/billing/invoices/invoice-1',
    },
  ];

  it('lists each task with a link to the record', () => {
    renderWithProviders(<ManagerTaskList tasks={tasks} />);
    expect(screen.getByText('Burst pipe in A1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /burst pipe/i })).toHaveAttribute(
      'href',
      '/maintenance/ticket-1'
    );
  });

  it('celebrates an empty queue rather than showing a blank panel', () => {
    renderWithProviders(<ManagerTaskList tasks={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });
});

describe('ManagerVacantUnits', () => {
  it('explains why an empty list is good news', () => {
    renderWithProviders(<ManagerVacantUnits units={[]} />);
    expect(screen.getByText(/everything is let/i)).toBeInTheDocument();
  });

  it('shows the rent at stake for each empty unit', () => {
    renderWithProviders(
      <ManagerVacantUnits
        units={[
          {
            id: 'unit-3',
            number: 'B1',
            propertyName: 'Riverside Court',
            rentAmount: 35000,
            bedrooms: 2,
            status: 'VACANT',
          },
        ]}
      />
    );
    expect(screen.getByText('Unit B1')).toBeInTheDocument();
    expect(screen.getByText(/35,000/)).toBeInTheDocument();
  });
});
