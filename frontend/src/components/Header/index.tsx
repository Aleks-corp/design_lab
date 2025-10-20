import { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Image from "../Image";
import User from "./User";
import { useAppSelector } from "../../redux/hooks";
import { selectIsAdmin, selectIsLoggedIn } from "../../redux/selectors";
import { LanguageSwitcher } from "../LangSwitcher/LangSwitcher";
import { useTranslation } from "react-i18next";

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <button
          className={styles.logo}
          type="button"
          onClick={() => (window.location.href = "/")}
        >
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Logo"
          />
        </button>
        <div className={styles.wrapper}></div>

        {isAdmin && (
          <Link className={cn("button-small", styles.button)} to="/upload-post">
            {t("upload-btn")}
          </Link>
        )}
        {!isLoggedIn ? (
          <div
            className={cn(styles.sign, {
              [styles.active]: visibleNav,
            })}
          >
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/register"
              onClick={() => setVisibleNav(false)}
            >
              {t("register")}
            </Link>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/login"
              onClick={() => setVisibleNav(false)}
            >
              {t("login")}
            </Link>
            <LanguageSwitcher />
          </div>
        ) : (
          <div
            className={cn(styles.sign, {
              [styles.active]: visibleNav,
            })}
          >
            <User
              className={styles.user}
              setVisibleNav={() => setVisibleNav(false)}
            />
            <LanguageSwitcher />
          </div>
        )}
        <button
          className={cn(styles.burger, {
            [styles.active]: visibleNav,
          })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

export default Headers;
