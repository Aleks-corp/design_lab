import cn from "classnames";
import styles from "./PassReset.module.sass";
import Control from "../../components/Control";
import { resetPassBreadcrumbs } from "../../constants/breadcrumbs.constants";
import { useTranslation } from "react-i18next";
import ResetPasswordForm from "../../components/PassResetForm";

const ResetPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={resetPassBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>{t("passchange.title")}</h1>
            <div className={styles.info}>
              {t("passchange.reset-text")}
              <strong>{t("passchange.reset-text-str")}</strong>.
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
