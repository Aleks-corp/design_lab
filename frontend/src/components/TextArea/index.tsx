import cn from "classnames";
import styles from "./TextArea.module.sass";
import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className: string;
  label: string;
}

const TextArea = ({ className, label, ...props }: TextAreaProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <textarea className={styles.textarea} {...props} />
      </div>
    </div>
  );
};

export default TextArea;
