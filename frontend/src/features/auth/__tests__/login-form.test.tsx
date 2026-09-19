import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/render-with-providers';
import { FormField } from '@/components/forms/form-field';
import { Input } from '@/components/ui/input';

/**
 * Covers the field wiring every auth form is built from: the label must point
 * at the control, and an error must be announced and associated, or screen
 * reader users get an unexplained rejection.
 */
describe('FormField accessibility wiring', () => {
  it('associates the label with the control', async () => {
    renderWithProviders(
      <FormField label="Email">
        <Input type="email" />
      </FormField>
    );

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();

    await userEvent.type(input, 'amina@example.co.ke');
    expect(input).toHaveValue('amina@example.co.ke');
  });

  it('marks a required field and flags it visually', () => {
    renderWithProviders(
      <FormField label="Password" required>
        <Input type="password" />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('announces an error and links it to the control', () => {
    renderWithProviders(
      <FormField label="Email" error="Enter a valid email address">
        <Input type="email" />
      </FormField>
    );

    const input = screen.getByLabelText('Email');
    const error = screen.getByRole('alert');

    expect(error).toHaveTextContent('Enter a valid email address');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.getAttribute('id'));
  });

  it('shows help text when there is no error, and hides it once there is', () => {
    const { rerender } = renderWithProviders(
      <FormField label="Phone" description="We use this for M-Pesa prompts">
        <Input />
      </FormField>
    );
    expect(screen.getByText(/m-pesa prompts/i)).toBeInTheDocument();

    rerender(
      <FormField label="Phone" description="We use this for M-Pesa prompts" error="Invalid number">
        <Input />
      </FormField>
    );
    expect(screen.queryByText(/m-pesa prompts/i)).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid number');
  });
});
