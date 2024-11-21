import cn from "classnames";
import styles from "./TextInput.module.sass";
import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  label: string;
}

const TextInput = ({ className, label, ...props }: TextInputProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input className={styles.input} {...props} />
      </div>
    </div>
  );
};

export default TextInput;
