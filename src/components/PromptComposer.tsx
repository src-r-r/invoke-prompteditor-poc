import { Box, Button, ButtonGroup, Container, Paper, Snackbar, Typography } from '@material-ui/core';
import Masonry from '@mui/lab/Masonry';
import AddIcon from '@mui/icons-material/Add';
import "./PromptComposer.css";
import { PromptLibrary } from './PromptLibrary';
import React, { useEffect, useState } from 'react';
import { $composition, $library, $slottedComposition, LibraryItem, PromptItem, addToOperation, insertIntoComposition, itemIsNugget, itemIsOperation, lassoNuggets, Composition, _setComposition, removeItemFromLibrary, removeFromComposition, removeNuggetFromOperation } from '../lib/prompt';
import { BackHand, Book, Category, DragHandle, LibraryBooks, MouseSharp, Score, Sort } from '@mui/icons-material';
import { useStore } from '@nanostores/react'
import Nugget from './Nugget';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Op, Operation } from './Operation';
import { EditorMode, PromptItemProps } from './PromptItem';
import { ReactSortable } from "react-sortablejs";
import { $dragDropState, $dropCandidate, $isDragInProgress, $sourceItem, CategoryMismatchError, completeDrop, endHoverOver, startDrag, startHoverOver } from '../store/prompt-dnd';

export interface PromptComposerProps {

}

export default function PromptComposer(props: PromptComposerProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (!open) { setOpen(true); }
  };

  const handleClose = () => {
    if (open) { setOpen(false); }
  };

  const composition = useStore($composition);

  // const [composition, setComposition] = useState(compStore);

  const handleOnInsertItem = (item: LibraryItem) => {
    console.log("INSERT %x INTO %s", item, composition)
    insertIntoComposition(item);
    console.log(composition)
  }

  const handleOnDeleteItem = (item: LibraryItem) => {
    removeItemFromLibrary(item);
    // also remove from the prompts
    composition.filter(c => {
      return (!("op" in c)) && c.item.id === item.id
    }).forEach((c) => {
      removeFromComposition(c);
    });
    // and from any operation
    composition.filter(c => {
      return "op" in c && c.items.find(o => o.item.id === item.id);
    }).forEach((o) => {
      if (!("op" in o)) return;
      o.items.forEach((i) => {
        if (i.item.id === item.id) removeNuggetFromOperation(o, i);
      })
    })
  }

  const [doSort, setDoSort] = useState(false);

  const [editMode, setEditMode] = useState("dnd" as EditorMode);

  const [error, setError] = useState(null as Error | null);

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
        if (editMode !== "dnd") return;
        if (itemIsNugget(promptItem)) {
          startDrag(item);
        }
        // TODO: operation
      },
      onDrop: (item: PromptItem) => {
        if (editMode !== "dnd") return;
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
      onDragEnd: () => {
        try {
          completeDrop();
        } catch (err) {
          if (err instanceof CategoryMismatchError) {
            setError(err);
          } else {
            throw err;
          }
        }
      },
      onMouseEnter: (item: PromptItem) => {
      },
      onMouseLeave: (item: PromptItem) => {
        if (editMode !== "dnd") return;
        endHoverOver();
      },
      onDelete: (item: PromptItem) => {
        if (editMode !== "dnd") return;
        removeFromComposition(item);
      },
    } as PromptItemProps;

    return ("op" in promptItem ?
      <Operation operation={promptItem} key={key} {...callbacks} />
      : <Nugget nugget={promptItem} key={key} isTopLevel={true} {...callbacks} />)
  }

  function setComposition(c: Composition) {
    console.log("updated composition: %x", c)
    _setComposition(c);
  }

  const handleSetEditMode = (
    event: React.MouseEvent<HTMLElement>,
    mode: EditorMode | null,
  ) => {
    if (mode) setEditMode(mode);
  };

  const handleErrorSnackbarClose = () => {
    setError(null);
  }


  return (
    <Box>
      <Container>
        <Stack direction="row" style={{ padding: "4pt" }} >
          <ButtonGroup>
            <Button onClick={handleClickOpen} >
              <LibraryBooks />
            </Button>
          </ButtonGroup>
          <ToggleButtonGroup
            value={editMode}
            exclusive
            onChange={handleSetEditMode}
            size="large"
          >
            <ToggleButton value="dnd" aria-label="drag-n-drop" size="large" style={{ padding: "4pt" }}>
              <BackHand />
            </ToggleButton>
            <ToggleButton value="sort" aria-label='score' style={{ padding: "4pt" }}>
              <Sort />
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography>
            <strong>{editMode} Mode</strong> enabled
          </Typography>
        </Stack>
      </Container>
      <Container className="composer-main">
        {editMode == "sort" ? (
          <ReactSortable list={composition} setList={setComposition}>
            {composition.map(c => promptItemFactory(c, `item-${c.id}`))}
          </ReactSortable>
        ) : composition.map(c => promptItemFactory(c, `item-${c.id}`))
        }
      </Container>
      <PromptLibrary
        open={open}
        onDeleteItem={handleOnDeleteItem}
        onInsertItem={handleOnInsertItem}
        onClose={handleClose} />
      <Snackbar
        message={error?.message}
        open={error !== null}
        autoHideDuration={6000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </Box>
  );
}