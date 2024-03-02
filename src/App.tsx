import React, { ChangeEvent, useEffect } from 'react';
import './App.css';
import PromptComposer from './components/PromptComposer';
import { Box, Tabs, Tab, Typography, Container } from '@material-ui/core';
import { $composition, $library, $textComposition, Category, Composition, Library, LibraryItem, addItemToLibrary, insertIntoComposition, lassoNuggets } from './lib/prompt';
import { TextPrompt } from './components/TextPrompt';
import { useStore } from '@nanostores/react';
import { Op } from './lib/operator';
import { v4 as uuid4 } from 'uuid';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = React.useState(0);

  const fillWithMockData = () => {
    const libItems = [
      { id: uuid4(), prompt: "cookie", category: Category.subject },
      { id: uuid4(), prompt: "chocolate", category: Category.subject },
      { id: uuid4(), prompt: "vintage photo", category: Category.vibes },
    ] as Library;
    const promptItems = [
      {
        id: uuid4(), items: [
          { id: uuid4(), item: libItems[0], score: -2 },
          { id: uuid4(), item: libItems[1], score: 1 },
        ], op: Op.AND,
      },
      { id: uuid4(), item: libItems[2], score: 0, },
    ] as Composition;

    $library.set(libItems);
    $composition.set(promptItems);
  }

  useEffect(() => {
    fillWithMockData();
  }, []);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="prompt-selection-tabs">
          <Tab label="Prompt Composer" {...a11yProps(0)} aria-label="prompt-composer-tab" />
          <Tab label="Text Prompt" {...a11yProps(1)} aria-label="text-prompt-tab" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PromptComposer />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TextPrompt />
      </CustomTabPanel>
    </Container>
  );
}

export default App;
