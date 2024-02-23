import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import ListItemButton from "@mui/material/ListItemButton";

export type Category = {
    id: string,
    label: string,
    color?: string,
}

const categories = [
    { id: "style", label: "Styles", color: "blue" },
    { id: "subject", label: "Subjects", color: "black" },
    { id: "vibes", label: "Vibes", color: "gold" },
    { id: "mediums", label: "Mediums", color: "black" },
] as Category[];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

export function PromptLibrary(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleNuggetClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Prompt Library</DialogTitle>
            <div>
                Prompt Library
            </div>
        </Dialog>
    );
}