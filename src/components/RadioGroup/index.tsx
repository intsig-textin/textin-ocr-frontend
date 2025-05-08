import classNames from "classnames";
import React, { useState } from "react";
import styles from "./index.module.less";

interface RadioButtonProps {
  style?: React.CSSProperties;
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  labelProps?: Record<string, any>;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  style,
  label,
  value,
  checked,
  onChange,
  labelProps,
}) => {
  return (
    <label
      className={classNames(styles.radioButton, "radioButton")}
      style={style}
      {...labelProps}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }} // 隐藏原始 radio 按钮
      />
      <span
        className={classNames(styles.radioButtonLabel, {
          [styles.radioButtonLabelChecked]: checked,
        })}
      >
        {label}
      </span>
    </label>
  );
};

interface RadioGroupProps {
  className?: string;
  style?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  options: { label: string; value: string; labelProps?: Record<string, any> }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "line" | "button";
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  style,
  optionStyle,
  options,
  defaultValue,
  value: propsValue,
  onChange,
  type = "button",
}) => {
  const [_value, _setValue] = useState(defaultValue || options[0].value);

  const value = propsValue || _value;

  const handleChange = (val: string) => {
    _setValue(val);
    onChange?.(val);
  };

  return (
    <div
      className={classNames(styles.radioGroup, {
        [className || ""]: true,
        [styles.lineTypeRadioGroup]: type === "line",
      })}
      style={style}
    >
      {options.map((option) => (
        <RadioButton
          style={optionStyle}
          key={option.value}
          label={option.label}
          value={option.value}
          checked={option.value === value}
          onChange={() => handleChange(option.value)}
          labelProps={option.labelProps}
        />
      ))}
    </div>
  );
};
