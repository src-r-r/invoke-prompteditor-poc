import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

test('renders Prompt Composer tab', () => {
  render(<App />);
  const tab = screen.getByText('Prompt Composer');
  expect(tab).toBeInTheDocument();
});

test('changes tab when clicked', () => {
  render(<App />);
  const tab = screen.getByText('Prompt Composer');
  fireEvent.click(tab);
  expect(screen.getByText('Text Prompt')).toBeInTheDocument();
});
