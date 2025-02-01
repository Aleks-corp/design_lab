import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Notification.module.sass";
import Icon from "../../Icon";
import { ClassNameProps } from "../../../types/className.types";

const Notification = ({ className }: ClassNameProps) => {
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

  return (
    <div ref={dropdownRef} className={cn(styles.notification, className)}>
      <button
        className={cn(styles.head, styles.active)}
        onClick={() => setVisible(!visible)}
      >
        <Icon title="notification" size={24} />
      </button>
      {visible && (
        <div className={styles.body}>
          <div className={cn("h4", styles.title)}>Notification</div>

          <Link
            className={cn("button-small", styles.button)}
            to="/activity"
            onClick={() => setVisible(!visible)}
          >
            See all
          </Link>
        </div>
      )}
    </div>
  );
};

export default Notification;
