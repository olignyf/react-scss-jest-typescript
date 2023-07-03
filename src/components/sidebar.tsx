/*eslint no-console: 0*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

/* extends {id:string|number}*/
interface Props {
  routes: {
    path: string;
    label: string;
    component: React.ReactElement;
  }[];
}


/**
 *
 */
export const Sidebar: (props: Props) => React.ReactElement<Props> = ({ routes }) => {
    const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
    <nav className={sidebar ? "sidebar active" : "sidebar"}>
      <button className="hamburger" type="button" onClick={showSidebar}>
        <div></div>
      </button>
      <ul onClick={showSidebar}>
        {routes.map(route => (
        <li><Link to={route.path}>{route.label}</Link></li>
        ))}
      </ul>
    </nav>
    
    <Routes>
        {routes.map(route => (
         <Route path={route.path} element={route.component} />  
        ))}
</Routes>
</>
  );
};

export default Sidebar;
