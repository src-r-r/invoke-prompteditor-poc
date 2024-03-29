import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { LibraryItem as LibItemType, $library, Category, LibraryItem, insertIntoComposition } from "../lib/prompt";
import { MouseEvent, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { NewLibraryItem } from "./NewLibraryItem";
import { DataGrid, GridApi, GridColDef, GridColTypeDef } from '@mui/x-data-grid';
import "./PromptLibrary.css"
import { title } from "../lib/util";
import { Add, Delete } from "@mui/icons-material";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void,
    // onAddItem: (item: LibItemType) => void,
    onInsertItem: (item: LibItemType) => void,
    onDeleteItem: (item: LibItemType) => void,
}


export function PromptLibrary(props: SimpleDialogProps) {
    const { open, onInsertItem, onClose, onDeleteItem } = props;

    const library = useStore($library);

    const [doCreate, setDoCreate] = useState(false);

    const [visibleCategories, setVisibleCategories] = useState(Object.keys(Category) as Category[]);

    const handleClose = () => {
        onClose();
    }

    const handleOnNewCreated = () => {
        setDoCreate(false);
    }

    const categoryChoices = Object.keys(Category);

    const filteredLibrary = useMemo(() => {
        return library.filter(item => visibleCategories.includes(item.category));
    }, [library, visibleCategories]);

    const columns: GridColDef[] = [
        {
            field: "insertPrompt", width: 50, renderCell: (params) => {
                const handleClick = ($e: MouseEvent<any>) => {
                    console.log(`clicked!`);
                    $e.stopPropagation();
                    const libItem = library.find(l => l.id === params.id) as LibItemType;
                    console.log("Inserting %o into composition", libItem);
                    if (libItem) onInsertItem(libItem);
                }
                return (
                    <Button onClick={handleClick}>
                        <Add />
                    </Button>
                );
            }, headerName: "",
        },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'prompt', headerName: 'Prompt', width: 250 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: "delete", headerName: "headerName", width: 50, renderCell: (params) => {
            const handleClick = ($e: MouseEvent<any>) => {
                $e.stopPropagation();
                const libItem = library.find(l => l.id === params.id) as LibItemType;
                if (libItem) onDeleteItem(libItem);
            }
            return (
                <Button onClick={handleClick}>
                    <Delete />
                </Button>
            );
        } },
    ];

    const rows = filteredLibrary.map(item => ({
        id: item.id,
        name: item.name || "",
        prompt: item.prompt,
        category: title(item.category),
    }));

    return (
        <Dialog
            hideBackdrop
            disableEnforceFocus
            fullWidth={true}
            maxWidth="lg"
            className="prompt-library-dialog"
            onClose={handleClose}
            open={open}
        >
            <DialogTitle>Prompt Library</DialogTitle>
            <div>
                <DataGrid rows={rows} columns={columns} style={{display: "block", width: "fit-contents"}} />
            </div>
            <NewLibraryItem onNewCreated={handleOnNewCreated} />
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}