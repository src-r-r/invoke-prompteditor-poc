import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('renders Prompt Composer tab', () => {
  render(<App />);
  const tab = screen.getByText('prompt-composer-tab');
  expect(tab).toBeInTheDocument();
});

test('changes tab when clicked', () => {
  render(<App />);
  const tab = screen.getByLabelText('text-prompt-tab');
  fireEvent.click(tab);
  expect(screen.getByLabelText('text-area')).toBeInTheDocument();
});
