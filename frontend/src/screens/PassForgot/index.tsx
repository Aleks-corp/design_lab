import cn from "classnames";
import styles from "./PassForgot.module.sass";
import Control from "../../components/Control";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassBreadcrumbs } from "../../constants/breadcrumbs.constants";
import ForgotPassForm from "../../components/PassForgotForm";
import { useTranslation } from "react-i18next";

const ForgotPassPage = () => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={forgotPassBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          {isSuccess && !notFound ? (
            <div className={styles.top}>
              <h1 className={cn("h2", styles.title)}>
                {t("passchange.forgot-subtitle")}
              </h1>
              <div className={styles.info}>
                <p>{t("passchange.forgot-notification")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.top}>
                <h1 className={cn("h2", styles.title)}>
                  {t("passchange.forgot-subtitle")}
                </h1>
                <div className={styles.info}>
                  {notFound ? (
                    <p>
                      {t("passchange.forgot-alert")}
                      <Link className={styles.link} to="/register">
                        {t("passchange.forgot-alert-link")}
                      </Link>
                      {t("passchange.forgot-alert-str")}
                    </p>
                  ) : (
                    <p>{t("passchange.forgot-lbl")}</p>
                  )}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.col}>
                  <ForgotPassForm
                    setIsSuccess={setIsSuccess}
                    setNotFound={setNotFound}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
