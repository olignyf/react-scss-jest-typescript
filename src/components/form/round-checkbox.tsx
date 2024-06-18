import classNames from 'classnames';
import React, { ReactNode } from 'react';

export enum CheckboxStyle {
  NORMAL = 'normal',
  HIGHLIGHT = 'highlight',
  OUTLINE = 'outline',
}

interface Props {
  checked?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (ev: React.ChangeEventHandler<HTMLInputElement>) => void;
  type?: CheckboxStyle;
  value?: string;
}

export const RoundCheckbox = (props:Props) => {
  const { checked,
  children,
  className,
  disabled,
  name,
  onChange,
  type = CheckboxStyle.NORMAL,
  value,
  ...rest} = props;  
  
  return (
    <label className={classNames('sdi-checkbox', 'unselectable', checked && 'checked', type, className)}>
      <input
        disabled={disabled}
        type="checkbox"
        value={value}
        style={{ display: 'none' }}
        name={name}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      {children}
    </label>
  );
};
