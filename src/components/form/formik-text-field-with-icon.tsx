import { useField } from 'formik';
import React from 'react';
import { FormField } from './form-field';
import { Label } from './label';
import { FormFieldError } from './form-field-error';
import { InputText } from './Input-text';

export enum Status {
  Error = 'error',
  Inactive = 'inactive',
  OK = 'ok',
  Paused = 'paused',
  Ready = 'ready',
  Starting = 'starting',
  Stopped = 'stopped',
  Stopping = 'stopping',
  Streaming = 'streaming',
  ToStorage = 'to-storage',
  Unassigned = 'unassigned',
  Warning = 'warning',
}

interface Props {
  name: string;
  mask?: boolean;
  status?: Status;
  title?: string;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  controlProps?: any;
  className?: string;
}

export const FormikTextFieldWithIcon: React.FunctionComponent<Props> = ({
  name,
  mask,
  title,
  status,
  disabled,
  placeholder,
  hint,
  required = false,
  className,
}) => {
  const [field, meta] = useField(name);
  const hasErrors = meta.error && meta.touched;

  const hasIcon = status != null;
  return (
    <FormField className={className}>
      <div className="d-flex">
        {title && <Label required={required}>{title}</Label>}
        {hasIcon && <Icon className="hai-ml-1" type="status" subtype={status} size="sm3" />}
      </div>
      <InputText
        disabled={disabled}
        invalid={hasErrors}
        placeholder={placeholder}
        hint={hint}
        {...field}
      ></InputText>
      <FormFieldError show={hasErrors} mssg={meta.error} />
    </FormField>
  );
};
