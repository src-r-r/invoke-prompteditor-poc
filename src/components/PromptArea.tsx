import { Button, ButtonGroup, Chip } from '@material-ui/core';
import React, { Children, Component, ReactNode } from 'react';
import Nugget from './Nugget';
import { Operation } from './Operation';
// import { Composable } from './IComposable';

type Composable = (typeof Nugget) | (typeof Operation);

export default function PromptArea({ children }: { children?: any }) {
    return (
        <div>
            {
                Children.map(children, child => {
                    return (<div>
                        {child as ReactNode}
                    </div>)
                })
            }
        </div>
    );
}