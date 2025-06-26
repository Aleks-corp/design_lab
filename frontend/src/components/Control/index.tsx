import cn from "classnames";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Control.module.sass";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";

interface ControlProps {
  className: string;
  item: {
    url?: string;
    title: { EN: string; UA: string };
  }[];
}

const Control = ({ className, item }: ControlProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useTheme();
  return (
    <div className={cn(styles.control, className)}>
      <div className={cn("container", styles.container)}>
        <button
          className={cn("button-stroke button-small", styles.button)}
          onClick={() => navigate(-1)}
        >
          <Icon title="arrow-prev" size={10} />
          <span>{t("Back")}</span>
        </button>
        <div className={styles.breadcrumbs}>
          {item.map((i, index) => (
            <div className={styles.item} key={index}>
              {i.url ? (
                <Link className={styles.link} to={i.url}>
                  {i.title[locale as "EN" | "UA"]}
                </Link>
              ) : (
                i.title[locale as "EN" | "UA"]
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Control;
