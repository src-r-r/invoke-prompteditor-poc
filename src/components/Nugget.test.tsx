import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import Nugget from './Nugget';

test('renders Nugget component', () => {
  const result = render(<Nugget text="Hello, world!" />);
  expect(result.container.querySelector(".text")?.textContent).toContain("Hello, world!");
});

test('updates score when up arrow is clicked', () => {
  const result = render(<Nugget text="Hello, world!" initialScore={0} />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const upButton = result.container.querySelector(".incScore");
  if (upButton) fireEvent.click(upButton);
  expect(result.container.querySelector(".score")?.textContent).toBe("+1");
});

test('updates score when down arrow is clicked', () => {
  const result = render(<Nugget text="Hello, world!" initialScore={0} />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const downButton = result.container.querySelector(".decScore");
  if (downButton) fireEvent.click(downButton);
  expect(result.container.querySelector(".score")?.textContent).toBe("-1");
});
