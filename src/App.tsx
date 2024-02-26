import React, { ChangeEvent } from 'react';
import './App.css';
import PromptComposer from './components/PromptComposer';
import { Box, Tabs, Tab, Typography } from '@material-ui/core';
import { $textComposition } from './lib/prompt';


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
      {...other}
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

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="prompt-area">
          <Tab label="Prompt Composer" {...a11yProps(0)} />
          <Tab label="Text Prompt" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <PromptComposer />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div>
          <textarea>{ $textComposition.get() }</textarea>
        </div>
      </CustomTabPanel>
    </>
  );
}

export default App;
