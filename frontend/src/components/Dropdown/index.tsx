import { useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Dropdown.module.sass";
import Icon from "../Icon";

interface DropdownProps {
  className: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}

const Dropdown = ({ className, value, setValue, options }: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (value: string) => {
    setValue(value);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(styles.dropdown, className, { [styles.active]: visible })}
      >
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.selection}>{value}</div>
          <div className={styles.arrow}>
            <Icon title="arrow-bottom" size={10} />
          </div>
        </div>
        <div className={styles.body}>
          {options.map((x, index) => (
            <div
              className={cn(styles.option, {
                [styles.selectioned]: x === value,
              })}
              onClick={() => handleClick(x)}
              key={index}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
