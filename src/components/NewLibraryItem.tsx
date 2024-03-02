import { Button, Container, FormControl, InputLabel, TextField } from "@material-ui/core";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category, LibraryItem, addItemToLibrary, categoryHasName } from "../lib/prompt";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"
import { Stack } from "@mui/material";
import "./NewLibraryItem.css"

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
        <Container className="new-item-form">
            <FormControl>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    native
                    labelId="category-select-label"
                    id="category-select"
                    value={category}
                    label="Category"
                    onChange={handleCategoryChange}
                >
                    {catChoices.map(c => (
                        <option key={c} value={c}>{titleCase(c)}</option>
                    ))}
                </Select>
            </FormControl>
            {categoryHasName(category) && (
                <FormControl>
                    <InputLabel id="name-textfield-label">Name</InputLabel>
                    <TextField
                        itemID="name-textfield-label"
                        id="name-textfield"
                        value={name}
                        onChange={handleNameChange}
                    />
                </FormControl>
            )
            }
            <FormControl>
                <InputLabel id="prompt-textfield-label">Prompt</InputLabel>
                <TextField
                    itemID="prompt-textfield-label"
                    id="prompt-textfield"
                    value={prompt}
                    onChange={handlePromptChange}
                />
            </FormControl>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleCreateItem}>Create</Button>
            </Stack>
        </Container>
    )
}