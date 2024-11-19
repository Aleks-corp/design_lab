import { useState } from "react";
import cn from "classnames";
import styles from "./Add.module.sass";
import Icon from "../../../../components/Icon";
import { ClassNameProps } from "../../../../types/className.types";

const Add = ({ className }: ClassNameProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <button
      className={cn(className, styles.add, {
        [styles.active]: visible,
      })}
      onClick={() => setVisible(!visible)}
    >
      <Icon title="add-square" size={24} />
      <Icon title="minus-square" size={24} />
    </button>
  );
};

export default Add;
