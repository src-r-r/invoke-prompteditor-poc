import { Button } from '@material-ui/core';
import Masonry from '@mui/lab/Masonry';
import AddIcon from '@mui/icons-material/Add';
import "./PromptComposer.css";
import { PromptLibrary } from './PromptLibrary';
import React, { useEffect, useState } from 'react';
import { $composition, $library, $slottedComposition, LibraryItem, PromptItem, addToOperation, insertIntoComposition, itemIsNugget, itemIsOperation, lassoNuggets, Composition } from '../lib/prompt';
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

  const composition = useStore($composition);

  // const [composition, setComposition] = useState(compStore);

  const handleOnInsertItem = (item: LibraryItem) => {
    console.log("INSERT %x INTO %s", item, composition)
    insertIntoComposition(item);
    console.log(composition)
  }

  /**
   * 
   * @param promptItem The prompt item that we're rendering
   * @param key The key
   * @returns Either a Nugget or an Operation component, relating to their native types.
   */
  const promptItemFactory = (promptItem: PromptItem, key: string) => {

    // These callbacks are mostly for drag-n-drop functionality.
    // they will be different based on whether the source or target
    // is either a Nugget or an Operation.
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
          composition.map(c => promptItemFactory(c, `item-${c.id}`))
        }
      </div>
    </div>
  );
}