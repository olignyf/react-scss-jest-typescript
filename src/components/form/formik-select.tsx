import { Field, FieldProps, useField } from 'formik';
import React from 'react';

interface Props {
  name: string;
  title?: string;
  required?: boolean;
  selectValues: any[];
  selectLabels: string[];
  disabled?: boolean;
  className?: string | string[];
  visibilityHidden?: boolean;
  direction?: string;
  onChange?: (e: any) => void;
}

export const FormikSelect = (props: Props) => {
 const { title,
  name,
  required,
  selectValues,
  selectLabels,
  disabled,
  className,
  visibilityHidden,
  direction = 'down',
  onChange, ...rest } = props;
  
  const [field] = useField(name);
  const defaultValue = (initialValue: string): string => {
    let defaultValue = head(selectLabels);
    selectValues.forEach((value: string, index: number) => {
      if (value === initialValue) {
        defaultValue = selectLabels[index];
        return;
      }
    });
    return defaultValue;
  };

  let additionalClassNames = '';
  if (Array.isArray(className)) {
    additionalClassNames = className.join(' ');
  } else if (className) {
    additionalClassNames = className;
  }

  if (visibilityHidden) {
    additionalClassNames += ' invisible';
  }

  const renderChildren = ({ meta, form }: FieldProps) => {
    const hasErrors = meta.error && meta.touched;
    return (
      <FormField className={`FormItem${additionalClassNames}`}>
        <Label required={required}>{title}</Label>
        <FormControl
          as="select"
          name={name}
          invalid={hasErrors}
          disabled={disabled}
          defaultSelect={defaultValue(meta.value || meta.initialValue)}
          selectMenuDirection={direction}
          onChange={onChange}
        >
          {selectLabels.map((textValue: string, index: number) => (
            <SelectOption
              key={selectValues[index]}
              value={selectValues[index]}
              onChange={() => {
                form.setFieldTouched(name, true);
                form.setFieldValue(name, selectValues[index], true);
              }}
            >
              {textValue}
            </SelectOption>
          ))}
        </FormControl>
        <FormFieldError show={hasErrors} mssg={meta.error} />
      </FormField>
    );
  };

  return <Field {...field}>{renderChildren}</Field>;
};
