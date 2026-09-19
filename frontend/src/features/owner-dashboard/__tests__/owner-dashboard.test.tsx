import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/render-with-providers';
import { OwnerOccupancyGrid } from '../components/owner-occupancy-grid';
import { OwnerQuickActions } from '../components/owner-quick-actions';

describe('OwnerOccupancyGrid', () => {
  it('summarises the portfolio size', () => {
    renderWithProviders(<OwnerOccupancyGrid occupied={18} vacant={4} maintenance={2} />);
    expect(screen.getByText(/24 units across your portfolio/i)).toBeInTheDocument();
  });

  it('breaks the counts out alongside the chart', () => {
    renderWithProviders(<OwnerOccupancyGrid occupied={18} vacant={4} maintenance={2} />);
    expect(screen.getByText('Occupied')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('handles a portfolio with no units at all', () => {
    renderWithProviders(<OwnerOccupancyGrid occupied={0} vacant={0} />);
    expect(screen.getByText(/no units yet/i)).toBeInTheDocument();
  });
});

describe('OwnerQuickActions', () => {
  it('links each action to the right create route', () => {
    renderWithProviders(<OwnerQuickActions />);
    expect(screen.getByRole('link', { name: /add a property/i })).toHaveAttribute(
      'href',
      '/properties/new'
    );
    expect(screen.getByRole('link', { name: /invite a tenant/i })).toHaveAttribute(
      'href',
      '/tenants/new'
    );
  });
});
