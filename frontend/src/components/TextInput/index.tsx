import cn from "classnames";
import styles from "./TextInput.module.sass";
import { ChangeEventHandler, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hookformprop?: UseFormRegisterReturn;
}

const TextInput = ({
  className,
  label,
  value,
  onChange,
  hookformprop,
  ...props
}: TextInputProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          {...props}
          {...hookformprop}
        />
      </div>
    </div>
  );
};

export default TextInput;
