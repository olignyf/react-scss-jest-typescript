import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// theme
// theme ends
import { UiThemeForTests } from './theme-for-tests';
import App from 'src/App';

export const HomePageJig: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const onCancel = (): void => {
    console.trace('onCancel');
  };

  const onReboot = (): void => {
    console.trace('onReboot');
  };

  return (
    <div>
      <UiThemeForTests />
      <App/>
    </div>
  );
};
