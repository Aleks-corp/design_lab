import cn from "classnames";
import styles from "./TextInput.module.sass";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hookformprop: UseFormRegisterReturn;
}

const TextInput = ({ label, hookformprop, ...props }: TextInputProps) => {
  return (
    <div className={cn(styles.field)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input className={styles.input} {...props} {...hookformprop} />
      </div>
    </div>
  );
};

export default TextInput;
