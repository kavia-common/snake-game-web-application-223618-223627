import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header and controls', () => {
  render(<App />);
  expect(screen.getByText(/Snake/i)).toBeInTheDocument();
  expect(screen.getByRole('group', { name: /Game controls/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/Snake game board/i)).toBeInTheDocument();
});
