import cn from "classnames";
import styles from "./SendEmail.module.sass";
import Control from "../../components/Control";
import { verifyUserBreadcrumbs } from "../../constants/breadcrumbs.constants";
import VerifyResendForm from "../../components/VerifyUserForm";
import { useTranslation } from "react-i18next";

const VerifyPageResend = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={verifyUserBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>
              {t("passchange.send-btn")}
            </h1>
            <div className={styles.info}>{t("passchange.verify-resend")}</div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <VerifyResendForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPageResend;
