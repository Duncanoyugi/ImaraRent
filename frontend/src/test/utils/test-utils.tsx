/**
 * Single import for tests: Testing Library's API plus the provider-aware
 * `render`, which shadows the bare one so nothing renders without context.
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export {
  renderWithProviders,
  renderWithProviders as render,
  createTestQueryClient,
} from './render-with-providers';
export * from '../mocks/data-mocks';
export * from '../mocks/api-mocks';
