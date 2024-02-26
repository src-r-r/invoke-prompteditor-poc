import { Checkbox, Dialog, DialogTitle } from "@material-ui/core";
import { LibraryItem as LibItemType, $library, Category } from "../lib/prompt";
import { LibraryItem } from "./LibraryItem";
import { ChangeEvent } from "react";
import { useStore } from "@nanostores/react";

export interface SimpleDialogProps {
    open: boolean;
    // onClose: (composable: Composable) => void,
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
    const { open, onInsertItem } = props;

    const library = useStore($library);

    const handleOnAddItem = (item: LibItemType) => {
        // onAddItem(item);
    }

    const handleOnInsertItem = (item: LibItemType) => {
        onInsertItem(item);
    }

    const filterCat = (catKey: string, catVal: string, v: ChangeEvent<HTMLInputElement>) => {
        const isChecked = v.target.value === '1';
        document.querySelectorAll(`.category-${catVal}`).forEach($el => {
            if (isChecked) show($el)
            else hide($el)
        });
    }

    return (
        <Dialog open={open}>
            <DialogTitle>Prompt Library</DialogTitle>
            <div className="categories">
                {Object.entries(Category).map(([catKey, catVal]) => {
                    return (
                        <div>
                            <Checkbox onChange={v => filterCat(catKey, catVal, v)} />
                            <span>{title(catVal)}</span>
                        </div>
                    )
                })}
            </div>
            <div>
                {
                    library?.map(item => <LibraryItem item={item} onInsertItem={handleOnInsertItem} />)
                }
            </div>
        </Dialog>
    );
}