import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { FormFieldError } from './form-field-error';


interface Props {
  id?: string;
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;  
  type?: string;
  value?: string;
  validationError?: string;
  onChange?: (event: React.ChangeEventHandler<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event:React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event:React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
}

export const InputText = (props:Props) => {
  const { children, className, disabled, name, invalid, type='text', value, validationError, onChange, onKeyDown, onKeyPress, onKeyUp, ...rest} = props;

  return (
    <label className={classNames('form-input-text', className, invalid && "invalid")}>
      <input        
        disabled={disabled}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        {...rest}
      />
      {children}
      {validationError && <FormFieldError text={validationError} />}
    </label>
  );
};
