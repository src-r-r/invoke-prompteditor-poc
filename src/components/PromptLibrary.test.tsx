import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptLibrary } from './PromptLibrary';
import { SimpleDialogProps } from './PromptLibrary';
import {
    Category, LibraryItem as LibItemType,
    Library as LibraryType,
    Composition as CompositionType,
    $library,
    $composition,
    addItemToLibrary,
    insertIntoComposition,
} from '../lib/prompt';
import {Op} from "../lib/operator"
import { randomUUID } from 'crypto';
import { act } from 'react-dom/test-utils';

const mockOnAddItem = jest.fn();
const mockItem: LibItemType = {
    id: randomUUID(),
    name: 'Test Item',
    category: Category.vibes,
    prompt: 'Test Prompt',
};

const mockOnClose = jest.fn();
const mockOnDeleteItem = jest.fn();

const mockOpen: boolean = true;

const mockProps: SimpleDialogProps = {
    open: mockOpen,
    onInsertItem: mockOnAddItem,
    onClose: mockOnClose,
    onDeleteItem: mockOnDeleteItem,
};

const mockLibrary: LibraryType = [
    { id: randomUUID(), name: "Name1", prompt: "Prompt1", category: Category.subject },
    { id: randomUUID(), name: "Name2", prompt: "Prompt2", category: Category.style },
    { id: randomUUID(), name: "Name3", prompt: "Prompt3", category: Category.vibes },
    { id: randomUUID(), name: "Name4", prompt: "Prompt4", category: Category.medium },
];

const mockComposition: CompositionType = [
    { id: randomUUID(), item: mockLibrary[0], score: 0 },
    { id: randomUUID(), item: mockLibrary[1], score: 0 },
    { id: randomUUID(), item: mockLibrary[2], score: 0 },
    { id: randomUUID(), item: mockLibrary[3], score: 0 },
    {
        id: randomUUID(), op: Op.AND, items: [
            { id: randomUUID(), item: mockLibrary[0], score: 0 },
            { id: randomUUID(), item: mockLibrary[1], score: 0 },
        ]
    },
];

beforeEach(() => {
    // clear out the library and composition
    $library.set([]);
    $composition.set([]);
    // insert the items
    mockLibrary.forEach(item => {
        addItemToLibrary(item);
        insertIntoComposition(item);
    });
});

test('renders PromptLibrary with add button', () => {
    render(<PromptLibrary {...mockProps} />);
    const addButton = screen.getAllByLabelText('Add').at(0);
    const itemName = screen.getByText((content, _) => {
        return content.includes(mockLibrary[0].prompt as string);
    });
    // @ts-ignore
    expect(addButton).toBeInTheDocument();
    // @ts-ignore
    expect(itemName).toBeInTheDocument();
});

test('calls onAddItem when add button is clicked', async () => {
    render(<PromptLibrary {...mockProps} />);
    const addButton = screen.getAllByLabelText('Add').at(0);
    act(() => {
        userEvent.click(addButton as HTMLElement);
    })
    expect(mockOnAddItem).toHaveBeenCalledWith(mockLibrary[0]);
});
