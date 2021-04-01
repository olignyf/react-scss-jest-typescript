import React from 'react';

import 'src/theme/light.scss';
//import 'bootstrap-less-port/dist/css/bootstrap.css';

import { initializeI18n } from 'src/i18n';
initializeI18n(); // FIXME move to Haiui theme test init

interface Props {}

export const UiThemeForTests: React.FunctionComponent<Props> = ({ children }) => {
  return (
      <body>
        {children}
      </body>
  );
};
