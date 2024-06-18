import { useField } from 'formik';
import React, { MutableRefObject, useState } from 'react';
import classNames from 'classnames';

interface Props {
  id?: string;
  visibilityHidden?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FormField = (props:Props) => {
 const { id, visibilityHidden, className, children } = props;

  return (
    <div id={id} className={classNames("p0p-form-field", className, visibilityHidden && 'visibilityHidden')}>
      {children}
    </div>
  );
};
