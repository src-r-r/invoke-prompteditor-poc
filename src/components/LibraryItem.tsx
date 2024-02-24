import { Composable } from "./IComposable";
import { LibraryItem as LibItem } from "../lib/prompt";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button } from "@material-ui/core";

export interface StyleProps {
    item: LibItem
    onAddItem: (item: LibItem) => void;
}

export function LibraryItem(props: StyleProps) {
    const { item, onAddItem } = props
    return (
        <div>
            <Button onClick={() => onAddItem(item)}>
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
    ) as Composable;
};