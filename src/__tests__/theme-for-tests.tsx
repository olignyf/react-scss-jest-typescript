import React from 'react';

import 'src/scss/light.scss';

import { initializeI18n } from 'src/i18n';
initializeI18n();

interface Props {}

import './unit-tests.scss';

export const UiThemeForTests: React.FunctionComponent<Props> = ({ children }) => {
  return (
      <body>
        {children}
      </body>
  );
};
