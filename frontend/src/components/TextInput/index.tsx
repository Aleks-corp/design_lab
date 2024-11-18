import cn from "classnames";
import styles from "./TextInput.module.sass";

interface TextInputProps {
  className: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}

const TextInput = ({
  className,
  label,
  name,
  type,
  placeholder,
  required,
  ...props
}: TextInputProps) => {
  return (
    <div className={cn(styles.field, className)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.wrap}>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={styles.input}
          {...props}
        />
      </div>
    </div>
  );
};

export default TextInput;
