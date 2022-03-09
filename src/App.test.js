import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';

test('renders main hero text', () => {
  render(<App />);
  const heroText = screen.getByText(/bulk nutrients samples/i);
  expect(heroText).toBeInTheDocument();
});

test('product filters generate', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByTestId(/state-filter-none-found/i));

  const productFilters = screen.getAllByTestId(/product-filter/i);
  expect(productFilters.length > 0).toBe(true);
});

test('state filters generate', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByTestId(/state-filter-none-found/i));

  const productFilters = screen.getAllByTestId(/state-filter/i);
  expect(productFilters.length > 0).toBe(true);
})

test('product scroll list generate', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByTestId(/no-results/i));

  const productFilters = screen.getAllByTestId(/product-card/i);
  expect(productFilters.length === 6).toBe(true);
})

test('show more button rendered', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByTestId(/no-results/i));

  const showMoreButton = screen.getByTestId(/show-more-button/i);  
  expect(showMoreButton).toBeInTheDocument();
});

test('product scroll list has more results', async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByTestId(/no-results/i));
  // Find show more button 
  const showMoreButton = screen.getByTestId(/show-more-button/i);
  fireEvent.click(showMoreButton);

  const productFilters = screen.getAllByTestId(/product-card/i);
  expect(productFilters.length === 12).toBe(true);
})