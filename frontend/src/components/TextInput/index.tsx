import cn from "classnames";
import styles from "./TextInput.module.sass";
import { ChangeEventHandler, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hookformprop?: UseFormRegisterReturn;
}

const TextInput = ({
  label,
  value,
  onChange,
  hookformprop,
  ...props
}: TextInputProps) => {
  return (
    <div className={cn(styles.field)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input
          className={styles.input}
          {...props}
          {...hookformprop}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default TextInput;
