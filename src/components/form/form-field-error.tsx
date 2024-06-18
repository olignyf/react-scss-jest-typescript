import { useField } from 'formik';
import React, { MutableRefObject, useState } from 'react';
import classNames from 'classnames';

interface Props {
  id?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export const FormFieldError = (props:Props) => {
 const { id, text, className, children } = props;

  return (
    <div id={id} className={classNames("p0p-form-field-error", className)}>
      {text}{children}
    </div>
  );
};
