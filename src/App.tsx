import React from 'react';
import logo from './logo.svg';
import './App.css';
import PromptArea from './components/PromptArea';
import { Op, Operation } from './components/Operation';
import Nugget from './components/Nugget';
import { Ast } from './lib/ast';

function App() {
  const ast = new Ast();
  const c = (
    <div className="App">
      <PromptArea>
        <Operation initialOp={Op.AND}>
          <Nugget text='cookie' />
          <Nugget text='chocolate' />
        </Operation>
      </PromptArea>
    </div>
  );

  console.log(c);

  return c;
}

export default App;
