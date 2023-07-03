import React from 'react';
import Button from 'react-bootstrap/Button';

import './App.scss';
import Sidebar from './components/sidebar';
import { Home } from './pages/home';
import { Components } from './pages/components';
import { Hardware } from './pages/hardware';
import { Help } from './pages/help';
import { Outlet } from 'react-router-dom';
import { Comparator } from './pages/comparator';
import { ComparatorCPU } from './pages/comparator-cpu';

const productRoutes = [
  {
    path: '/',
    label: 'Home',
    component: <Home/>
  },
  {
    path: '/comparator',
    label: 'Comparator',
    component: <Comparator/>
  },/*
  {
    path: '/comparator/cpu',
    label: 'Comparator CPU',
    component: <ComparatorCPU/>
  },*/
  {
    path: '/components',
    label: 'Components',
    component: <Components/>
  },
  {
    path: '/components/hardware',
    label: 'Components > Hardware',
    component: <Hardware/>
  },
  {
    path: '/help',
    label: 'Help',
    component: <Help/>
  }
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button>Click Me</Button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>



      <div id="outlet">OUTLET
      <Outlet />
      </div>
      
      <Sidebar routes={productRoutes}/>

    </div>
  );
}

export default App;
