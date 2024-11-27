import cn from "classnames";
import styles from "./Switch.module.sass";

interface SwitchProps {
  className?: string;
  value: boolean;
  setValue: (newValue: boolean) => void;
  name: string;
}

const Switch = ({ className, value, setValue, name }: SwitchProps) => {
  return (
    <label className={cn(styles.switch, className)}>
      <input
        className={styles.input}
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
      />
      <div className={styles.inner}>
        <div className={name ? styles.imgbox : styles.box}>
          {name && (
            <div className={styles.innerbox}>
              <img src={`/images/kit-logo/${name}-prog.svg`} alt="logo" />
            </div>
          )}
        </div>
      </div>
    </label>
  );
};

export default Switch;
