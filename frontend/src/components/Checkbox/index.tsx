import cn from "classnames";
import styles from "./Checkbox.module.sass";

interface CheckboxProps {
  className: string;
  content: string;
  value: boolean;
  onChange: () => void;
}

const Checkbox = ({ className, content, value, onChange }: CheckboxProps) => {
  return (
    <label className={cn(styles.checkbox, className)}>
      <input
        className={styles.input}
        type="checkbox"
        onChange={onChange}
        checked={value}
      />
      <span className={styles.inner}>
        <span className={styles.tick}></span>
        <span className={styles.text}>{content}</span>
      </span>
    </label>
  );
};

export default Checkbox;
