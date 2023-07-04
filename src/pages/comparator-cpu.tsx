
import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

/**
 *
 */
export const ComparatorCPU: (props: Props) => React.ReactElement = (props) => {
  
    return <><h1>Comparator CPU</h1>
    {props.children}</>;
};
  