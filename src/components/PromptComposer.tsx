import { Button } from '@material-ui/core';
import Masonry from '@mui/lab/Masonry';
import AddIcon from '@mui/icons-material/Add';
import "./PromptComposer.css";
import { PromptLibrary } from './PromptLibrary';
import React, { useEffect, useState } from 'react';
import { $slottedComposition, LibraryItem, PromptItem, addToOperation, insertIntoComposition, itemIsNugget, itemIsOperation, lassoNuggets } from '../lib/prompt';
import { Category } from '@mui/icons-material';
import { useStore } from '@nanostores/react'
import Nugget from './Nugget';
import { Stack } from '@mui/material';
import { Op, Operation } from './Operation';
import { PromptItemProps } from './PromptItem';
import { $dragDropState, $dropCandidate, $isDragInProgress, $sourceItem, completeDrop, endHoverOver, startDrag, startHoverOver } from '../store/prompt-dnd';

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

  const promptItemFactory = (promptItem: PromptItem, key: string) => {

    const callbacks = {
      onDragStart: (item: PromptItem) => {
        if (itemIsNugget(promptItem)) {
          startDrag(item);
        }
        // TODO: operation
      },
      onDrop: (item: PromptItem) => {
        const dnd = useStore($dragDropState);
        const isDragInProgress = useStore($isDragInProgress);
        const dropCandidate = useStore($dropCandidate);
        const sourceItem = useStore($sourceItem);
        if (!(sourceItem && dropCandidate)) {
          return;
        }
        if (itemIsNugget(dropCandidate) && itemIsNugget(sourceItem)) {
          // TODO: show a pop-up to select the operator.
          lassoNuggets(dropCandidate.id, sourceItem.id, Op.AND);
        }
        if (itemIsNugget(sourceItem) && itemIsOperation(dropCandidate)) {
          addToOperation(sourceItem.id, dropCandidate.id);
        }
        completeDrop();
      },
      onDragEnd: (item: PromptItem) => {
        
      },
      onMouseEnter: (item: PromptItem) => {
      },
      onMouseLeave: (item: PromptItem) => {
        endHoverOver();
      },
    } as PromptItemProps;

    return ("op" in promptItem ?
      <Operation operation={promptItem} key={key} {...callbacks} />
      : <Nugget nugget={promptItem} key={key} isTopLevel={true} {...callbacks} />)
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
            <>
              {itemCol.map((promptItem, j) => promptItemFactory(promptItem, `item-${j}-${j}`))}
            </>
          ))
        }
      </div>
    </div>
  );
}