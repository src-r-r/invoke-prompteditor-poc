import { Button, ButtonGroup, Chip, Divider } from '@material-ui/core';
import React, { Component, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowUp';

import "./Nugget.css";
import { Nugget as NuggetType, decreaseNuggetScore, increaseNuggetScore } from '../lib/prompt';

export interface NuggetProps {
    nugget : NuggetType,
}

export default function Nugget(props : NuggetProps) {
    const {nugget} = props;

    const scoreDisp = nugget.score > 0 ? "+" + nugget.score : nugget.score;
    
    return (
        <div className='nugget'>
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