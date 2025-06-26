import "react-phone-number-input/style.css";
import cn from "classnames";
import styles from "./SignUp.module.sass";
import Control from "../../components/Control";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDateForSale } from "../../helpers/getDateForSale";
import { registerBreadcrumbs } from "../../constants/breadcrumbs.constants";
import { Trans, useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();

  const [dateForSale, setDateForSale] = useState<number>(1);

  const TrialInfo = ({ dateForSale }: { dateForSale: number }) => {
    return (
      <p>
        <Trans
          i18nKey="reg-trial-info"
          values={{ days: dateForSale, limit: 2 }}
          components={{
            1: <span key="1" />,
            3: <span key="3" />,
            5: <span key="5" />,
          }}
        />
      </p>
    );
  };

  useEffect(() => {
    const fetchDate = async () => {
      const result = await getDateForSale();
      setDateForSale(result);
    };

    fetchDate();
  }, []);

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={registerBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>{t("register-title")}</h1>
            <div className={styles.trialBanner}>
              <h3 className={styles.trialTitle}>{t("register-trial")}</h3>
              <p>{TrialInfo({ dateForSale })}</p>
            </div>

            <div className={styles.info}>
              <p>{t("register-info")}</p>
              <p>
                {t("register-warn-start")}
                <Link className={styles.link} to="/login">
                  {t("register-warn-end")}
                </Link>
              </p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
