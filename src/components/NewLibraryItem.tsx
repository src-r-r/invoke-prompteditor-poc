import { Button, FormControl, InputLabel, MenuItem, TextField } from "@material-ui/core";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category, LibraryItem, addItemToLibrary, categoryHasName } from "../lib/prompt";
import { ChangeEvent, useState } from "react";
import {v4 as uuidv4} from "uuid"

export interface NewLibraryItemProps {
    onNewCreated?: () => void;
}

export function NewLibraryItem(props: NewLibraryItemProps) {
    const { onNewCreated } = props;

    const [category, setCategory] = useState(Category.subject);
    const [name, setName] = useState("");
    const [prompt, setPrompt] = useState("");

    const handleCategoryChange = (e: any | SelectChangeEvent) => {
        setCategory(e.target.value as Category);
    }
    const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setName(e.target.value);
    }
    const handlePromptChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }

    const titleCase = (s: string) => {
        return s[0].toUpperCase() + s.substring(1);
    }

    const handleCreateItem = () => {
        const libraryItem = {
            id: uuidv4(),
            category,
            name: categoryHasName(category) ? name : null,
            prompt,
        } as LibraryItem;
        addItemToLibrary(libraryItem);
        setCategory(Category.subject);
        setName("");
        setPrompt("");
        onNewCreated ? onNewCreated() : null;
    }

    const catChoices = Object.keys(Category);

    return (
        <div>
            <div>
                <FormControl>
                    <InputLabel htmlFor="new-prompt-category">Category</InputLabel>
                    <Select
                        native
                        id="new-prompt-category"
                        aria-label="Prompt Item Category"
                        value={category}
                        onChange={(e) => handleCategoryChange(e)}
                    >
                        {catChoices.map(cat => (
                            <option value={cat} id={cat} key={cat}>{titleCase(cat)}</option>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div>
                <FormControl>
                    {categoryHasName(category) ? (<InputLabel htmlFor="name">Name</InputLabel>) : <></>}
                    {categoryHasName(category) ? (<TextField aria-label="Prompt Item Name" value={name} onChange={handleNameChange} id="name" />) : <></>}
                </FormControl>
            </div>
            <div>
                <FormControl>
                    <InputLabel htmlFor="prompt">Prompt</InputLabel>
                    <TextField aria-label="Prompt Item Text" value={prompt} onChange={handlePromptChange} id="prompt" />
                    <Button onClick={handleCreateItem} >Create</Button>
                </FormControl>
            </div>
        </div>
    )
}