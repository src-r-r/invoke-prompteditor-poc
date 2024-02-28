import { Button, Checkbox, Dialog, DialogTitle } from "@material-ui/core";
import { LibraryItem as LibItemType, $library, Category } from "../lib/prompt";
import { LibraryItem } from "./LibraryItem";
import { ChangeEvent, useState } from "react";
import { useStore } from "@nanostores/react";
import { ExitToAppOutlined } from "@mui/icons-material";
import { NewLibraryItem } from "./NewLibraryItem";
import "./PromptLibrary.css"

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void,
    // onAddItem: (item: LibItemType) => void,
    onInsertItem: (item: LibItemType) => void,
}

function title(text: string) {
    return (!text.length) ? "" : ((text.length === 1) ? text.toUpperCase() : text[0].toUpperCase() + text.substring(1).toLowerCase());
}


const hide = ($el: Element) => {
    if (!$el.classList.contains("hidden")) $el.classList.add("hidden");
}

const show = ($el: Element) => {
    if (!$el.classList.contains("hidden")) $el.classList.remove("hidden");
}

export function PromptLibrary(props: SimpleDialogProps) {
    const { open, onInsertItem, onClose } = props;

    const library = useStore($library);

    const [doCreate, setDoCreate] = useState(false);

    const [visibleCategories, setVisibleCategories] = useState([] as Category[]);

    const handleOnAddItem = (item: LibItemType) => {
        // onAddItem(item);
    }

    const handleOnInsertItem = (item: LibItemType) => {
        onInsertItem(item);
    }

    const filterCat = (catKey: string, v: ChangeEvent<HTMLInputElement>) => {
        const isChecked = v.target.value === '1';
        setVisibleCategories((visibleCategories.includes(catKey as Category) && !isChecked) ? visibleCategories.filter(c => c != catKey) : [...visibleCategories, catKey as Category]);
        document.querySelectorAll(`.category-${catKey}`).forEach($el => {
            if (isChecked) show($el)
            else hide($el)
        });
    }

    const handleClose = () => {
        onClose();
    }

    const handleOnNewCreated = () => {
        setDoCreate(false);
    }

    const categoryChoices = Object.keys(Category);

    return (
        <Dialog className="prompt-library-dialog" onClose={handleClose} open={open}>
            <DialogTitle>Prompt Library</DialogTitle>
            <div className="categories">
                {categoryChoices.map(catKey => {
                    return (
                        <div key={catKey}>
                            <Checkbox onChange={v => filterCat(catKey, v)} />
                            <span>{title(catKey)}</span>
                        </div>
                    )
                })}
            </div>
            <div>
                {
                    library?.map(item => <LibraryItem key={item.id} item={item} onInsertItem={handleOnInsertItem} />)
                }
            </div>
            <div>
                <Button onClick={() => setDoCreate(true)}>Create</Button>
            </div>
            {doCreate ? (<NewLibraryItem onNewCreated={handleOnNewCreated} />) : (<></>)}
        </Dialog>
    );
}