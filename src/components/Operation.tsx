import { Menu, MenuItem } from "@material-ui/core";
import React, { Children, ReactNode } from 'react';
import "./Operation.css";
import { Op } from "../lib/operator";
import { randomUUID } from "crypto";
import { Composable } from "./IComposable";
import { Operation as OperationType, changeOperationOp } from "../lib/prompt";
import Nugget from "./Nugget";

interface OperationProps {
  operation : OperationType
}

function Operation(props : OperationProps) {
  const {operation} = props;

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [id,] = React.useState(randomUUID);

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
    <div className="operation" onContextMenu={handleContextMenu}>
      <div className="title">{operation.op}</div>
      <div className="nuggets">
        {
          operation.items.map(nugget => {
            return <Nugget nugget={nugget} />
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
  ) as Composable;
}

export { Operation, Op };