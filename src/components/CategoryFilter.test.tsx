import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFilter } from "./CategoryFilter";
import { $library, Category, LibraryItem } from "../lib/prompt";

const mockOnFiltered = jest.fn();

const library: LibraryItem[] = [
    { id: "1", prompt: "Hello", category: Category.style },
    { id: "2", prompt: "World", category: Category.vibes },
];

describe("CategoryFilter", () => {
    beforeEach(() => {
        $library.set(library);
    });

    it("renders checkboxes for each category", () => {
        render(<CategoryFilter onFiltered={mockOnFiltered} />);

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(2);
    });

    it("filters the library based on checked categories", async () => {
        render(<CategoryFilter onFiltered={mockOnFiltered} />);

        const styleCheckbox = screen.getByLabelText("style");
        const vibesCheckbox = screen.getByLabelText("vibes");

        userEvent.click(styleCheckbox);
        userEvent.click(vibesCheckbox);

        expect(mockOnFiltered).toHaveBeenCalledWith([library[0]]);
    });
});
