import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders LightTrade brand text', async () => {
  render(<App />);
  const elements = await screen.findAllByText(/LightTrade/i, {}, { timeout: 3000 });
  expect(elements.length).toBeGreaterThan(0);
});
