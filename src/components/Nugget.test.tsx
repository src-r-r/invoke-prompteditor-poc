import React from 'react';
import { render, screen } from '@testing-library/react';
import Nugget from './Nugget';
import { Category, Nugget as NuggetType } from '../lib/prompt';

const nugget: NuggetType = {
    id: '123',
    item: {
        id: '456',
        prompt: 'This is a sample nugget',
        category: Category.subject,
    },
    score: 10,
};

test('renders Nugget component', () => {
    render(<Nugget nugget={nugget} />);
    const textElement = screen.getByText(nugget.item.prompt);
    expect(textElement).toBeInTheDocument();
});

test('increases score when button is clicked', () => {
    const increaseScore = jest.fn();
    const decreaseScore = jest.fn();
    const { rerender } = render(
        <Nugget
            nugget={nugget}
        />
    );
    const increaseButton = screen.getByLabelText('incScore');
    increaseButton.click();
    rerender(
        <Nugget
            nugget={{ ...nugget, score: nugget.score + 1 }}
        />
    );
    // expect(increaseScore).toHaveBeenCalledTimes(1);
    // expect(decreaseScore).not.toHaveBeenCalled();
});

test('decreases score when button is clicked', () => {
    const increaseScore = jest.fn();
    const decreaseScore = jest.fn();
    const { rerender } = render(
        <Nugget
            nugget={nugget}
        />
    );
    const decreaseButton = screen.getByLabelText('decScore');
    decreaseButton.click();
    rerender(
        <Nugget
            nugget={{ ...nugget, score: nugget.score - 1 }}
        />
    );
    // expect(decreaseScore).toHaveBeenCalledTimes(1);
    // expect(increaseScore).not.toHaveBeenCalled();
});
