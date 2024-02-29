import { LibraryItem as LibItem } from "../lib/prompt";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button } from "@material-ui/core";

export interface StyleProps {
    item: LibItem
    onInsertItem: (item: LibItem) => void;
}

export function LibraryItem(props: StyleProps) {
    const { item, onInsertItem } = props
    return (
        <div className={`library-item ${item.category}`}>
            <Button onClick={() => onInsertItem(item)} aria-label="Add">
                <AddCircleOutlineOutlinedIcon/>
            </Button>
            <span>
                {
                    item.name ? (
                        <div className={`catetory-${item.category}`}>{item.name} - {item.prompt}</div>
                    ) : (<div>{item.prompt}</div>)
                }
            </span>
        </div>
    );
};