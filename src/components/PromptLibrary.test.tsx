import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptLibrary } from './PromptLibrary';
import { SimpleDialogProps } from './PromptLibrary';
import { Category, LibraryItem as LibItemType } from '../lib/prompt';
import { randomUUID } from 'crypto';

const mockOnAddItem = jest.fn();
const mockItem: LibItemType = {
    id: randomUUID(),
    name: 'Test Item',
    category: Category.vibes,
    prompt: 'Test Prompt',
};

const mockOnClose = jest.fn();

const mockOpen: boolean = true;

const mockProps: SimpleDialogProps = {
    open: mockOpen,
    onInsertItem: mockOnAddItem,
};

test('renders PromptLibrary with add button', () => {
    render(<PromptLibrary {...mockProps} />);
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
    render(<PromptLibrary {...mockProps} />);
    const addButton = screen.getByLabelText('Add');
    await userEvent.click(addButton);
    expect(mockOnAddItem).toHaveBeenCalledWith(mockItem);
});
