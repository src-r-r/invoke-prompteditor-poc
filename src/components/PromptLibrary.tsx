import { Dialog, DialogTitle } from "@material-ui/core";
import { Composable } from "./IComposable";
import { Library as PromptLibraryType, LibraryItem as LibItemType } from "../lib/prompt";
import { LibraryItem } from "./LibraryItem";

export interface SimpleDialogProps {
    open: boolean;
    onClose: (composable: Composable) => void,
    library: PromptLibraryType,
    onAddItem : (item : LibItemType) => void,
}

export function PromptLibrary(props: SimpleDialogProps) {
    const { onClose, library, open, onAddItem } = props;

    const handleClose = () => {
        // onClose(selectedValue);
    };

    const handleNuggetClick = (composable : Composable) => {
        onClose(composable);
    };

    const handleOnAddItem = (item : LibItemType) => {
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Prompt Library</DialogTitle>
            <div>
                {
                    library.map(item => <LibraryItem item={item} onAddItem={handleOnAddItem} />)
                }
            </div>
        </Dialog>
    );
}