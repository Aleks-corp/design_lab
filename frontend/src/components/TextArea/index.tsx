import cn from "classnames";
import styles from "./TextArea.module.sass";
import { TextareaHTMLAttributes, ChangeEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  hookformprop?: UseFormRegisterReturn;
}

const TextArea = ({
  className,
  label,
  value,
  onChange,
  hookformprop,
  ...props
}: TextAreaProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={onChange}
          {...props}
          {...hookformprop}
        />
      </div>
    </div>
  );
};

export default TextArea;
