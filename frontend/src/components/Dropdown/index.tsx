import { useState, useRef, useEffect } from "react";
import cn from "classnames";
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = (value: string) => {
    setValue(value);
    setVisible(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(styles.dropdown, className, { [styles.active]: visible })}
    >
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        <div className={styles.selection}>{value}</div>
        <div className={styles.arrow}>
          <Icon title="arrow-bottom" size={10} />
        </div>
      </div>
      {visible && (
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
      )}
    </div>
  );
};

export default Dropdown;
