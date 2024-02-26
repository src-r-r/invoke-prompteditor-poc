import { expect, test } from 'jest-without-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LibraryItem } from './LibraryItem';
import { Category, LibraryItem as LibItem } from '../lib/prompt';
import { randomUUID } from 'crypto';
import { act } from 'react-dom/test-utils';


const mockOnAddItem = jest.fn();

const mockItem: LibItem = {
    id: randomUUID(),
    name: 'Test Item',
    category: Category.medium,
    prompt: 'Test Prompt',
};

test('renders library item with add button', () => {
    render(<LibraryItem item={mockItem} onInsertItem={mockOnAddItem} />);

    const addButton = screen.getByLabelText('Add');
    const itemName = screen.getByText((content, element) => {
        return content.includes(mockItem.name as string);
      });
    
 // @ts-ignore
    expect(addButton).toBeInTheDocument();
 // @ts-ignore
    expect(itemName).toBeInTheDocument();
});

test('calls onAddItem when add button is clicked', async () => {
    render(<LibraryItem item={mockItem} onInsertItem={mockOnAddItem} />);

    const addButton = screen.getByLabelText('Add');

    act(() => {
        userEvent.click(addButton);
    })


    expect(mockOnAddItem).toHaveBeenCalledWith(mockItem);
});
