import cn from "classnames";
import styles from "./SignIn.module.sass";
import Control from "../../components/Control";
import { Link } from "react-router-dom";
import { loginBreadcrumbs } from "../../constants/breadcrumbs.constants";
import { useTranslation } from "react-i18next";
import SignInForm from "../../components/SignInForm";

const SignIn = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={loginBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}> {t("login-title")}</h1>
            <div className={styles.info}>
              {t("login-info-start")}
              <Link className={styles.link} to="/register">
                {t("register")}
              </Link>
              {t("login-info-end")}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
