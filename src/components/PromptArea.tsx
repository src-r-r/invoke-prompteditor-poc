import { Button } from '@material-ui/core';
import { Children, ReactNode } from 'react';
import Nugget from './Nugget';
import { Operation } from './Operation';
import AddIcon from '@mui/icons-material/Add';
import "./PromptArea.css";
import { PromptLibrary } from './PromptLibrary';
import React from 'react';

type Composable = (typeof Nugget) | (typeof Operation);

export default function PromptArea({ children }: { children?: any }) {
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const handleComposableClicked = (composable : Composable) => {
    setSelectedComposable(composable);
  }

    return (
        <div>
            <Button className="add-button">
                <AddIcon />
                <PromptLibrary
                    open={isPromptLibraryOpen}
                    onClose={handleClose}
                    ></PromptLibrary>

            </Button>
            <div>
            {
                Children.map(children, child => {
                    return (<div>
                        {child as ReactNode}
                    </div>)
                })
            }
            </div>
        </div>
    );
}