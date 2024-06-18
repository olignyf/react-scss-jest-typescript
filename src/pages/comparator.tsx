
import { ReactElement, ReactNode } from 'react';
import { GenericObject } from '../models/generics';
import { Link, Outlet, Route, Router, Routes, useNavigate } from 'react-router-dom';
import { ComparatorCPU } from './comparator-cpu';

/* extends {id:string|number}*/
interface Props<T extends GenericObject> {
    children?: ReactElement[]; // each mapping to a T element with key = T.id
    list?: T[];
}

/**
 *
 */
export const Comparator = <T extends GenericObject>(props: Props<T>) => {
    const { children, list } = props
    const navigate = useNavigate();
  
    return <>
    <h1>Comparator</h1>
    <Link to="/comparator/cpu" onClick={() => navigate("/comparator/cpu")}>CPU</Link>
   
     <Routes>
      <Route
        path="/comparator/cpu"
        element={<ComparatorCPU/>}>
      
        </Route>
     </Routes>
    {children}
    </>;
  };
  