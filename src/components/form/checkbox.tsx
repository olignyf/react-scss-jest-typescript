import { useField } from 'formik';
import React, { MutableRefObject, useState } from 'react';
import { InputText } from './Input-text';
import { FormField } from './form-field';
import { Label } from './label';
import { FormFieldError } from './form-field-error';

interface Props {
  id?: string;
  name: string;
  checked?: boolean;
  title?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  controlProps?: any;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
  inputRef?: MutableRefObject<any>;
  visibilityHidden?: boolean;
}

export const Checkbox = (props:Props) => {
 const { id,
  name,
  checked,
  title,
  placeholder,
  hint,
  disabled,
  autoFocus,
  className,
  inputClassName,
  onChange,
  onKeyUp,
  onFocus,
  onBlur,
  inputRef,
  visibilityHidden, ...restField } = props;

  let additionalClassNames = className ? ` ${className}` : '';
  if (visibilityHidden) {
    additionalClassNames += ' invisible';
  }

  const [focus, setFocus] = useState(false);

  const showError = hint ? !focus : true;

  return (
    <FormField className={`FormItem${additionalClassNames}`}>
      {title && (
        <Label htmlFor={id || name}>
          {title}
        </Label>
      )}
      <input type="checkbox"
        id={id || name}
        className={inputClassName}
        placeholder={focus ? placeholder : undefined}
        disabled={disabled}
        autoFocus={autoFocus}
        //inputRef={inputRef}
        onKeyUp={onKeyUp}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          onChange?.(event);
        }}
        onFocus={(event: React.FocusEvent<HTMLInputElement> & FocusEvent): void => {
          setFocus(true);
          onFocus?.(event);
        }}
        onBlur={(event: React.FocusEvent<HTMLInputElement> & FocusEvent): void => {
          setFocus(false);
          onBlur?.(event);
        }}
        checked={checked}
        {...restField}
      />
    </FormField>
  );
};
