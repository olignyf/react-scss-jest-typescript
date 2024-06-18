import { useField } from 'formik';
import React, { MutableRefObject, useState } from 'react';
import { InputText } from './Input-text';
import { FormField } from './form-field';
import { Label } from './label';
import { FormFieldError } from './form-field-error';

interface Props {
  id?: string;
  name: string;
  mask?: boolean;
  title?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  controlProps?: any;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  onChange?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement> & FocusEvent) => void;
  inputRef?: MutableRefObject<any>;
  visibilityHidden?: boolean;
}

export const FormikInput: React.FunctionComponent<Props> = ({
  id,
  name,
  title,
  placeholder,
  hint,
  required,
  type = 'text',
  disabled,
  autoFocus,
  autoComplete,
  className,
  inputClassName,
  onChange,
  onKeyUp,
  onKeyDown,
  onFocus,
  onBlur,
  inputRef,
  visibilityHidden,
}) => {
  const [field, meta] = useField(name);
  const { value: value, onChange: fieldOnChange, onBlur: fieldOnBlur, ...restField } = field; // restField contains name, multiple and checked
  const hasErrors = meta.error && meta.touched;
  let additionalClassNames = className ? ` ${className}` : '';
  if (visibilityHidden) {
    additionalClassNames += ' invisible';
  }

  const [focus, setFocus] = useState(false);

  const showError = hint == null ? true : !focus;

  return (
    <FormField className={`FormItem${additionalClassNames}`}>
      {title && (
        <Label required={required} htmlFor={id || name}>
          {title}
        </Label>
      )}
      <InputText
        id={id || name}
        className={inputClassName}
        type={type}
        placeholder={focus ? hint ?? placeholder : placeholder ?? hint}
        invalid={hasErrors}
        disabled={disabled}
        autoFocus={autoFocus}
        inputRef={inputRef}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onChange={(event: React.KeyboardEvent<HTMLInputElement> & FormChangeEvent): void => {
          onChange?.(event);
          fieldOnChange(event);
        }}
        onFocus={(event: React.FocusEvent<HTMLInputElement> & FocusEvent): void => {
          setFocus(true);
          onFocus?.(event);
        }}
        onBlur={(event: React.FocusEvent<HTMLInputElement> & FocusEvent): void => {
          setFocus(false);
          fieldOnBlur(event);
          onBlur?.(event);
        }}
        value={value}
        autoComplete={autoComplete ?? 'off'}
        showHint={hint}
        {...restField}
      />
      {showError && <FormFieldError show={hasErrors} mssg={meta.error} />}
    </FormField>
  );
};
