import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { NewLibraryItem } from './NewLibraryItem';
import { Category, addItemToLibrary, categoryHasName } from '../lib/prompt';

jest.mock('../lib/prompt', () => ({
    addItemToLibrary: jest.fn(),
    categoryHasName: jest.fn(),
    Category: {
        subject: "subject",
        vibes: "vibes",
        medium: "medium",
    },
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

        fireEvent.click(screen.getByLabelText('Prompt Item Category').querySelectorAll('option')[1]);

        expect(screen.getByLabelText('Prompt Item Name')).toBeInTheDocument();
    });

    it('changes the prompt', () => {
        render(<NewLibraryItem />);

        fireEvent.change(screen.getByLabelText('Prompt'), {
            target: { value: 'Test' },
        });

        expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('creates a new library item', async () => {
        render(<NewLibraryItem />);

        await act(async () => {
            fireEvent.click(screen.getByLabelText('Prompt Item Category').querySelectorAll('option')[1]);
        });
        await waitFor(() => {
            expect(screen.getByLabelText('Prompt Item Name')).toBeInTheDocument();
        })
        fireEvent.change(screen.getByLabelText('Prompt Item Name'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByLabelText('Prompt Item Text'), {
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
