import { useState } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";

interface PreviewProps {
  className?: string;
  title: string;
  description: string;
}

const Preview = ({ className, title, description }: PreviewProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className={cn(className, styles.item, { [styles.active]: visible })}>
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        {title}
      </div>
      <div className={styles.body}>
        <div className={styles.content}>{description}</div>
        {/* <button className={cn("button-stroke button-small", styles.button)}>
          Learn more
        </button> */}
      </div>
    </div>
  );
};

export default Preview;
