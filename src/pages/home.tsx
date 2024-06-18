
import React, { ReactNode } from 'react';
import logo from '../logo.svg';

interface Props {
  children?: ReactNode;

}

/**
 *
 */
export const Home = (props: Props) => {
  
    return <>Welcome
    
    <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p></>;
};
  