import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {NewLibraryItem} from './NewLibraryItem';
import { Category, addItemToLibrary, categoryHasName } from '../lib/prompt';

jest.mock('../lib/prompt', () => ({
    Category: Category,
    addItemToLibrary: jest.fn(),
    categoryHasName: jest.fn(),
}));

describe('NewLibraryItem', () => {
    beforeEach(() => {
        (addItemToLibrary as jest.Mock).mockReset();
        (categoryHasName as jest.Mock).mockReset();
    });

    it('renders the form', () => {
        render(<NewLibraryItem />);

        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('Subject')).toBeInTheDocument();
        expect(screen.getByText('Prompt')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('changes the category', () => {
        render(<NewLibraryItem />);

        fireEvent.change(screen.getByLabelText('Prompt Item Category'), {
            target: { value: Category.vibes },
        });

        expect(screen.getByLabelText('Prompt Item Name')).toBeVisible();
    });

    it('changes the name', () => {
        render(<NewLibraryItem />);

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test' },
        });

        expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('changes the prompt', () => {
        render(<NewLibraryItem />);

        fireEvent.change(screen.getByLabelText('Prompt'), {
            target: { value: 'Test' },
        });

        expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('creates a new library item', () => {
        render(<NewLibraryItem />);

        fireEvent.change(screen.getByLabelText('Category'), {
            target: { value: Category.subject },
        });
        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByLabelText('Prompt'), {
            target: { value: 'Test' },
        });
        fireEvent.click(screen.getByText('Create'));

        expect(addItemToLibrary).toHaveBeenCalledWith({
            category: Category.subject,
            name: 'Test',
            prompt: 'Test',
        });
    });
});
