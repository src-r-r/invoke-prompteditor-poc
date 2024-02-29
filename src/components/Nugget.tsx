import { Button, ButtonGroup, Chip, Divider } from '@material-ui/core';
import React, { Component, DragEvent, useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowUp';
import { $composition, Nugget as NuggetType, decreaseNuggetScore, increaseNuggetScore } from '../lib/prompt';
import "./Nugget.css";
import "./PromptItem.css"
import { $sourceItem, cancelDrop, completeDrop, isPromptItemDropTarget, startDrag, startHoverOver } from '../store/prompt-dnd';
import { PromptItemProps } from './PromptItem';
import { useStore } from '@nanostores/react';

export interface NuggetProps extends PromptItemProps {
    nugget: NuggetType,
}

export default function Nugget(props: NuggetProps) {

    const { nugget,
        onDragStart,
        onDragOver,
        onDragEnd,
        onDrop,
        onMouseEnter,
        onMouseLeave,
    } = props;

    const scoreDisp = nugget.score > 0 ? "+" + nugget.score : nugget.score;

    const sourceItem = useStore($sourceItem);
    const composition = useStore($composition)
    const thisId = `prompt-item-${nugget.id}`

    const handleOnDragStart = () => {
        onDragStart ? onDragStart(nugget) : null;
    }

    const handleOnMouseEnter = () => {
        if (!sourceItem) {
            return;
        }
        startHoverOver(nugget);
    }

    const handleOnMouseLeave = () => {
        onMouseLeave ? onMouseLeave(nugget) : null;
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

    return (
        <div
            className='nugget prompt-item'
            id={thisId}
            draggable
            onDragStart={handleOnDragStart}
            onDragOver={handleOnDragOver}
            onDragEnd={handleOnDragEnd}
            onMouseEnter={handleOnMouseEnter}
            onMouseOut={handleOnMouseLeave}
            data-promptitem-id={nugget.id}
        >
            <span className='text'>{nugget.item.name || nugget.item.prompt}</span>
            <Divider orientation="vertical" variant="middle" flexItem />
            <span className='score'>{scoreDisp}</span>
            <span className='buttons'>
                <ButtonGroup size="small" orientation='vertical'>
                    <Button onClick={() => increaseNuggetScore(nugget.id)} className='incScore' aria-label="incScore">
                        <KeyboardArrowUpIcon />
                    </Button>
                    <Button onClick={() => decreaseNuggetScore(nugget.id)} className='decScore' aria-label='decScore'>
                        <KeyboardArrowDownIcon />
                    </Button>
                </ButtonGroup>
            </span>
        </div>
    );
}