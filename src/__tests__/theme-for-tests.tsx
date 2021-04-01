import React from 'react';

import 'src/theme/light.scss';
//import 'bootstrap-less-port/dist/css/bootstrap.css';


interface Props {}

export const UiThemeForTests: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};
