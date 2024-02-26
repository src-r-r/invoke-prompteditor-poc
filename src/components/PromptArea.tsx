import { Button } from '@material-ui/core';
import Masonry from '@mui/lab/Masonry';
import Nugget from './Nugget';
import { Operation } from './Operation';
import AddIcon from '@mui/icons-material/Add';
import "./PromptArea.css";
import { PromptLibrary } from './PromptLibrary';
import React from 'react';
import { $composition, $slottedComposition, LibraryItem, insertIntoComposition } from '../lib/prompt';
import { Category } from '@mui/icons-material';
import { useStore } from '@nanostores/react'

type Composable = (typeof Nugget) | (typeof Operation);

export default function PromptArea(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const handleOnInsertItem = (item: LibraryItem) => {
    insertIntoComposition(item);
  }

  const slottedComposition = useStore($slottedComposition);

  return (
    <div>
      <Button className="add-button">
        <AddIcon />
        <PromptLibrary
          open={open}
          onInsertItem={handleOnInsertItem}
        ></PromptLibrary>

      </Button>
      <Masonry columns={Object.keys(Category).length} spacing={2} sequential>
          <div>Something</div>
      </Masonry>
    </div>
  );
}