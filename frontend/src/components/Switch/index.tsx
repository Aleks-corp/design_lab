import cn from "classnames";
import styles from "./Switch.module.sass";

interface SwitchProps {
  className?: string;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

const Switch = ({ className, value, setValue }: SwitchProps) => {
  return (
    <label className={cn(styles.switch, className)}>
      <input
        className={styles.input}
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
      />
      <span className={styles.inner}>
        <span className={styles.box}></span>
      </span>
    </label>
  );
};

export default Switch;
