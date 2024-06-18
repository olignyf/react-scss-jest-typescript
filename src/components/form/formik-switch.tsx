import { useField } from 'formik';
import React from 'react';
import { FormFieldError } from './form-field-error';
import { FormField } from './form-field';
import { Label } from './label';

interface Props {
  name: string;
  title?: string;
  disabled?: boolean;
  switchLabel?: string;
  required?: boolean;
  labelPlacement?: string;
  loading?: boolean;
  controlProps?: any;
  className?: string;
  visibilityHidden?: boolean;
  height?: string;
  checked?: boolean;
  onSwitchText?: string;
  offSwitchText?: string;
  onChange?: (value: any) => any;
}

export const FormikSwitch: React.FunctionComponent<Props> = ({
  title,
  name,
  disabled,
  required,
  labelPlacement = 'left',
  loading,
  switchLabel,
  className,
  visibilityHidden,
  height,
  checked,
  onSwitchText,
  offSwitchText,
  onChange,
}) => {
  const [, meta, helper] = useField(name);
  const hasErrors = meta.error && meta.touched;
  const value = meta.touched ? meta.value : meta.initialValue;

  let additionalClassNames = className ? ` ${className}` : '';
  let additionalSwitchClassNames = '';
  if (visibilityHidden) {
    additionalClassNames += ' invisible';
  }

  if (height === 'short') {
    additionalSwitchClassNames += ' short';
  }

  return (
    <FormField className={`FormItem${additionalClassNames}`}>
      {title && <Label required={required}>{title}</Label>}
      {loading === true ? (
        <div className="p0p-switch-placeholder-label">
          <div>{switchLabel}</div>
          <Placeholder as="layout" />
        </div>
      ) : (
        <Switch
          className={additionalSwitchClassNames}
          checked={checked ?? value}
          onChange={(newValue: boolean) => {
            helper.setTouched(true);
            helper.setValue(newValue);
            onChange?.(newValue);
          }}
          label={switchLabel}
          invalid={hasErrors ? 'true' : 'false'}
          disabled={disabled}
          onSwitchText={onSwitchText}
          offSwitchText={offSwitchText}
          labelPlacement={labelPlacement}
        />
      )}
      <FormFieldError show={hasErrors} mssg={meta.error} />
    </FormField>
  );
};
