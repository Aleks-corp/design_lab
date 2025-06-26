import { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Group.module.sass";
import Icon from "../../Icon";
import { useTheme } from "../../../helpers/darkModeContext";

interface GroupProps {
  className: string;
  item: {
    title: { EN: string; UA: string };
    menu: {
      url: string;
      title: { EN: string; UA: string };
    }[];
  };
}

const Group = ({ className, item }: GroupProps) => {
  const [visible, setVisible] = useState(false);
  const { locale } = useTheme();

  return (
    <div className={cn(className, styles.group, { [styles.active]: visible })}>
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        {item.title[locale as "EN" | "UA"]}
        <Icon title="arrow-bottom" size={10} />
      </div>
      <div className={styles.menu}>
        {item.menu.map((x, index) =>
          x.url.startsWith("http") ? (
            <a
              className={styles.link}
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              {x.title[locale as "EN" | "UA"]}
            </a>
          ) : (
            <Link className={styles.link} to={x.url} key={index}>
              {x.title[locale as "EN" | "UA"]}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Group;
