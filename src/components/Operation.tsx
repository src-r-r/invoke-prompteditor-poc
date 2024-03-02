import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Children, DragEvent, ReactNode, useEffect } from 'react';
import "./Operation.css";
import { Op } from "../lib/operator";
import { v4 as randomUUID } from "uuid";
import { $composition, Category, Operation as OperationType, changeOperationOp, togglePromptItemMute, unlassooOperation } from "../lib/prompt";
import Nugget from "./Nugget";
import { PromptItemProps } from "./PromptItem";
import { useStore } from "@nanostores/react";
import { $sourceItem, cancelDrop, completeDrop, startHoverOver } from "../store/prompt-dnd";
import { VolumeUp, VolumeOff, Delete, Add, RotateLeftOutlined, Shuffle, Repeat, ArrowOutward } from "@mui/icons-material";

interface OperationProps extends PromptItemProps {
  operation: OperationType
}

function Operation(props: OperationProps) {
  const { operation, onDragStart, onDragOver, onDragEnd, onDrop, onMouseEnter, onDelete, onMouseLeave } = props;

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
    if (onDragEnd) onDragEnd();
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

  const handleDelete = () => {
    onDelete(operation);
  }

  const changeOperator = (opV: string) => {
    changeOperationOp(operation.id, opV as Op);
    handleClose();
  }


  const className = [...(operation.muted === true ? ["muted"] : []), ...[
    "operation",
    operation.op,
    "prompt-item",
  ]].join(" ");

  console.log("operation classname: %s", className);

  const handleUngroup = () => {
    unlassooOperation(operation);
  }

  const getCategoryIcon = () => {
    return {
      [Op.AND]: (<Add />),
      [Op.JOINED]: (<Add />),
      [Op.SWAP]: (<Shuffle />),
      [Op.SWAPPED]: (<Shuffle />),
      [Op.BLEND]: (<Repeat />),
      [Op.BLENDED]: (<Repeat />),
    }[operation.op];
  }

  return (
    <li
      draggable
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
      onDragOver={handleOnDragOver}
      onMouseEnter={handleOnMouseEnter}
      onMouseOut={handleOnMouseLeave}
      className={className}
      onContextMenu={handleContextMenu}
      data-promptitem-id={operation.id}
    >
      <span className='delete'>
        <Button onClick={handleDelete}>
          <Delete />
        </Button>
      </span>
      <div className="title">{operation.op}</div>
      <div className="nuggets">
        {
          operation.items.map((nugget, i) => {
            return (
              <>
                <Nugget nugget={nugget} isTopLevel={false} onDelete={i => { }} />
                {i < operation.items.length-1 && (<span className="op-icon">{getCategoryIcon()}</span>)}
              </>
            )
          })
        }
      </div>
      <span className='hide'>
        <Button onClick={() => togglePromptItemMute(operation.id)}>
          {operation.muted ? <VolumeUp /> : <VolumeOff />}
        </Button>
      </span>
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
        <MenuItem onClick={handleUngroup}>
          Ungroup
        </MenuItem>
      </Menu>
    </li>
  );
}

export { Operation, Op };