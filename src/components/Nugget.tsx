import { Button, ButtonGroup, Chip, Divider } from '@material-ui/core';
import React, { Component, DragEvent, useEffect, useState } from 'react';
import {KeyboardArrowUp, KeyboardArrowDown} from '@mui/icons-material';
import { $composition, Nugget as NuggetType, decreaseNuggetScore, increaseNuggetScore, togglePromptItemMute } from '../lib/prompt';
import "./Nugget.css";
import "./PromptItem.css"
import { $sourceItem, cancelDrop, completeDrop, isPromptItemDropTarget, startDrag, startHoverOver } from '../store/prompt-dnd';
import { PromptItemProps } from './PromptItem';
import { useStore } from '@nanostores/react';
import { ArrowDownward, Delete, TextDecrease, VolumeMute, VolumeOff, VolumeUp } from '@mui/icons-material';

export interface NuggetProps extends PromptItemProps {
    nugget: NuggetType,
    isTopLevel?: boolean,
}

export default function Nugget(props: NuggetProps) {

    const { nugget,
        onDragStart,
        onDragEnd,
        onMouseLeave,
        isTopLevel,
        onDelete,
    } = props;

    const scoreDisp = nugget.score > 0 ? "+" + nugget.score : nugget.score;

    const sourceItem = useStore($sourceItem);
    const composition = useStore($composition)
    const thisId = `prompt-item-${nugget.id}`

    const className = [...(nugget.muted === true ? ["muted"] : []), ...[
        isTopLevel ? "toplevel" : "child",
        "nugget",
        "prompt-item",
    ]].join(" ");

    console.log("nugget classname: %s", className);

    const handleOnDragStart = (e: DragEvent) => {
        if ("checkForDrag" in window) {
            if (Math.abs((window.checkForDrag as number) - e.clientX) < 5) {
                return e.stopPropagation();
            }
        }
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
        if (onDragEnd) onDragEnd();
    }

    const handleDelete = () => {
        onDelete(nugget);
    }

    const mouseDownCoords = (e: MouseEvent) => {
        (window as any).checkForDrag = e.clientX;
    }

    const handleIncClick = () => {
        console.log("decrease %s", nugget.id);
        increaseNuggetScore(nugget.id);
    }

    const handleDecClick = () => {
        console.log("increase %s", nugget.id);
        decreaseNuggetScore(nugget.id);
    }

    return (
        <li
            className={className}
            id={thisId}
            draggable
            onDragStart={handleOnDragStart}
            onDragOver={handleOnDragOver}
            onDragEnd={handleOnDragEnd}
            onMouseEnter={handleOnMouseEnter}
            onMouseOut={handleOnMouseLeave}
            data-promptitem-id={nugget.id}
        >
            {isTopLevel && (<span className='delete'>
                <Button onClick={handleDelete}>
                    <Delete />
                </Button>
            </span>)
            }
            <span className='text'>{nugget.item.name || nugget.item.prompt}</span>
            <Divider orientation="vertical" variant="middle" flexItem />
            <span className='score'>{scoreDisp}</span>
            <span className='buttons'>
                <ButtonGroup size="small" orientation='vertical'>
                    <Button onClick={handleIncClick} className='incScore' aria-label="incScore">
                        <KeyboardArrowUp />
                    </Button>
                    <Button onClick={handleDecClick} className='decScore' aria-label='decScore'>
                        <KeyboardArrowDown />
                    </Button>
                </ButtonGroup>
            </span>
            {isTopLevel &&
                <span className='hide'>
                    <Button onClick={() => togglePromptItemMute(nugget.id)}>
                        {nugget.muted ? <VolumeUp /> : <VolumeOff />}
                    </Button>
                </span>
            }
        </li>
    );
}