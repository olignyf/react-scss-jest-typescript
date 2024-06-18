import { useField } from 'formik';
import React from 'react';
import { FormField } from './form-field';
import { Checkbox } from './checkbox';

interface Props {
  name: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  checked?: boolean;
}

export const FormikCheckbox = (props:Props) => {
  const { name, disabled, label, className, checked, ...rest } = props;  
  const [, meta, helper] = useField(name);
  const hasErrors = meta.error && meta.touched;
  const value = meta.touched ? meta.value : meta.initialValue;

  const additionalClassNames = className ? ` ${className}` : '';

  return (
    <FormField className={`FormItem${additionalClassNames}`}>
      <Checkbox
        checked={checked ?? value}
        onChange={(e: any) => {
          const { checked } = e.target;
          helper.setTouched(true);
          helper.setValue(checked);
        }}
        invalid={hasErrors ? 'true' : 'false'}
        disabled={disabled}
      >
        {label}
      </Checkbox>
      {/*<InputFieldError show={hasErrors} mssg={meta.error} />*/}
    </FormField>
  );
};
