import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Control.module.sass";
import Icon from "../Icon";

interface ControlProps {
  className: string;
  item: {
    url?: string;
    title: string;
  }[];
}

const Control = ({ className, item }: ControlProps) => {
  const navigate = useNavigate();
  return (
    <div className={cn(styles.control, className)}>
      <div className={cn("container", styles.container)}>
        <button
          className={cn("button-stroke button-small", styles.button)}
          onClick={() => navigate(-1)}
        >
          <Icon title="arrow-prev" size={10} />
          <span>Back</span>
        </button>
        <div className={styles.breadcrumbs}>
          {item.map((x, index) => (
            <div className={styles.item} key={index}>
              {x.url ? (
                <Link className={styles.link} to={x.url}>
                  {x.title}
                </Link>
              ) : (
                x.title
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Control;
