import { Button, ButtonGroup, Chip, Divider } from '@material-ui/core';
import React, { Component, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowUp';

import "./Nugget.css";

export default function Nugget({ text, initialScore }: { text: string, initialScore?: number }) {
    const [score, setScore] = useState(initialScore || 0);
    return (
        <div className='nugget'>
            <span className='text'>{text}</span>
            <Divider orientation="vertical" variant="middle" flexItem />
            <span className='score'>{score > 0 ? "+" + score : score}</span>
            <span className='buttons'>
            <ButtonGroup size="small" orientation='vertical'>
                <Button onClick={() => setScore(score + 1)} className='incScore'>
                    <KeyboardArrowUpIcon />
                </Button>
                <Button onClick={() => setScore(score - 1)} className='decScore'>
                    <KeyboardArrowDownIcon />
                </Button>
            </ButtonGroup>
            </span>
        </div>
    );
}