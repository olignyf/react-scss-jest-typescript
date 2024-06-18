import React from 'react';
import classNames from 'classnames';

interface Props {
  id?: string;
  htmlFor?: string;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
}

export const Label = (props:Props) => {
 const { id, htmlFor, className, children } = props;

  return (
    <label id={id} htmlFor={htmlFor} className={classNames("p0p-form-field", className, required && 'required')}>
      {children}
    </label>
  );
};
