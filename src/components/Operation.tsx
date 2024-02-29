import { Menu, MenuItem } from "@material-ui/core";
import React, { Children, DragEvent, ReactNode, useEffect } from 'react';
import "./Operation.css";
import { Op } from "../lib/operator";
import { v4 as randomUUID } from "uuid";
import { $composition, Operation as OperationType, changeOperationOp } from "../lib/prompt";
import Nugget from "./Nugget";
import { PromptItemProps } from "./PromptItem";
import { useStore } from "@nanostores/react";
import { $sourceItem, cancelDrop, completeDrop, startHoverOver } from "../store/prompt-dnd";

interface OperationProps extends PromptItemProps {
  operation: OperationType
}

function Operation(props: OperationProps) {
  const { operation, onDragStart, onDragOver, onDragEnd, onDrop, onMouseEnter, onMouseLeave } = props;

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [id,] = React.useState(randomUUID);
  const sourceItem = useStore($sourceItem);
  const handleOnDragStart = () => {
    onDragStart ? onDragStart(operation) : null;
  }

  const composition = useStore($composition);


  const handleOnMouseEnter = () => {
    if (!sourceItem) {
      return;
    }
    startHoverOver(operation);
  }


  const handleOnMouseLeave = () => {
    onMouseLeave ? onMouseLeave(operation) : null;
  }

  const handleOnDragOver = ($e: DragEvent) => {
    if (!sourceItem) return;
    // extract the prompt item's ID:
    const targetId = $e.currentTarget.getAttribute("data-promptitem-id");
    if (sourceItem.id == targetId) return;
    console.log("current target id: %s", targetId);
    const promptItem = composition.find(i => (targetId === i.id));
    if (!promptItem) {
      console.warn("Could not find promptitem with ID %s", targetId);
      console.log(composition.map(c => c.id));
      return;
    }
    startHoverOver(promptItem);
  }

  const handleOnDragEnd = () => {
    completeDrop();
  }
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const changeOperator = (opV: string) => {
    changeOperationOp(operation.id, opV as Op);
    handleClose();
  }

  return (
    <div
      draggable
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      onDragOver={handleOnDragOver}
      onMouseEnter={handleOnMouseEnter}
      onMouseOut={handleOnMouseLeave}
      className={`operation ${operation.op} prompt-item`}
      onContextMenu={handleContextMenu}
      data-promptitem-id={operation.id}
    >
      <div className="title">{operation.op}</div>
      <div className="nuggets">
        {
          operation.items.map(nugget => {
            return <Nugget nugget={nugget} isTopLevel={false} />
          })
        }
      </div>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {Object.values(Op).map((v) => {
          return (
            <MenuItem onClick={() => changeOperator(v)}>{v}</MenuItem>
          )
        })}
      </Menu>
    </div>
  );
}

export { Operation, Op };