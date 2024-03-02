import React, { useState } from "react";
import { $library, Category, LibraryItem } from "../lib/prompt";
import { useStore } from "@nanostores/react";
import { title } from "../lib/util";

export type CategoryToggle = {[key in Category]? : boolean}

interface CategoryFilterProps {
    onFiltered: (filteredLibrary: LibraryItem[]) => void;
}

export function CategoryFilter(props: CategoryFilterProps) {
    const library = useStore($library);
    const cats = Object.keys(Category);
    const [categoryToggle, setCategoryToggle] = useState(
        Object.fromEntries(
            Array(cats.length).map(
                (_, i) => [cats[i] as Category, true]
            )
        ) as CategoryToggle
    );

    const handleCheckboxChange = (category: Category) => {
        setCategoryToggle({
            ...categoryToggle,
            [category]: !(categoryToggle[category]),
        })
        props.onFiltered(library.filter((item) => categoryToggle[item.category]))
    };

    return (
        <div>
            {Object.values(Category).map((category) => (
                <label key={category} onClick={() => handleCheckboxChange(category)}>
                    <input
                        type="checkbox"
                        checked={categoryToggle[category]}
                    />
                    {title(category)}
                </label>
            ))}
        </div>
    );
}