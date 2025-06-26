import cn from "classnames";
import styles from "./PassChange.module.sass";
import Control from "../../components/Control";
import { setPassBreadcrumbs } from "../../constants/breadcrumbs.constants";
import ChangePasswordForm from "../../components/PassChangeForm";
import { useTranslation } from "react-i18next";

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <Control className={styles.control} item={setPassBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>{t("passchange.title")}</h1>
            <div className={styles.info}>
              {t("passchange.text")}
              <strong>{t("passchange.text-str")}</strong>.
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
