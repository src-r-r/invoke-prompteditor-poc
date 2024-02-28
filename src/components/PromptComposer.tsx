import { Button } from '@material-ui/core';
import Masonry from '@mui/lab/Masonry';
import AddIcon from '@mui/icons-material/Add';
import "./PromptComposer.css";
import { PromptLibrary } from './PromptLibrary';
import React, { useState } from 'react';
import { $slottedComposition, LibraryItem, PromptItem, insertIntoComposition } from '../lib/prompt';
import { Category } from '@mui/icons-material';
import { useStore } from '@nanostores/react'
import Nugget from './Nugget';
import { Stack } from '@mui/material';
import { Operation } from './Operation';

export interface PromptComposerProps {

}

export default function PromptComposer(props: PromptComposerProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnInsertItem = (item: LibraryItem) => {
    insertIntoComposition(item);
  }

  const slottedComposition = useStore($slottedComposition);

  const promptItemFactory = (promptItem : PromptItem, key : string) => {
    return "op" in promptItem ? <Operation operation={promptItem} key={key} /> : <Nugget nugget={promptItem} key={key} />
  }

  return (
    <div>
      <div>
        <Button className="add-button" onClick={handleClickOpen}>
          <AddIcon />
          <PromptLibrary
            open={open}
            onInsertItem={handleOnInsertItem}
            onClose={handleClose}
          ></PromptLibrary>
        </Button>
      </div>
      <div>
        {
          slottedComposition.map((itemCol, i) => (
              <Stack>
                {itemCol.map((promptItem, j) => promptItemFactory(promptItem, `item-${j}-${j}`))}
              </Stack>
            ))
        }
      </div>
    </div>
  );
}