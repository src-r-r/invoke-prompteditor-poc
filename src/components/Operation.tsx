import { Menu, MenuItem } from "@material-ui/core";
import React, { Children, ReactNode } from 'react';
import "./Operation.css";
import { Op } from "../lib/operator";
import { randomUUID } from "crypto";


function Operation({ children, initialOp }: { children: ReactNode[], initialOp: Op}) {
    const [op, setOp] = React.useState(initialOp);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);

      const [id, ] = React.useState(randomUUID);

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

      const changeOperator = (opV : string) => {
        setOp(opV as unknown as Op);
        handleClose();
      }

    return (
        <div className="operation" onContextMenu={handleContextMenu}>
            <div className="title">{op}</div>
            <div className="nuggets">
                {Children.map(children, child => {
                    return (<div>
                        {child}
                    </div>)
                })}
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