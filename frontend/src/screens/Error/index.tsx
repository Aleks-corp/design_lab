import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Error.module.sass";
import Icon from "../../components/Icon";

const ErrorPage = () => {
  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <Link className={styles.back} to="/">
            <Icon title="arrow-prev" size={24} />
            <div className={cn("h2", styles.stage)}>HOME</div>
          </Link>
        </div>
        <div className={styles.body}>
          <div className={styles.wrapper}>
            <div className={styles.item}>
              <div className={cn("h3", styles.title)}>404 Not Found</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
