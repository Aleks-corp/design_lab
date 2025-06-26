import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Image from "../Image";
import User from "./User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsAdmin, selectIsLoggedIn } from "../../redux/selectors";
import { fetchPosts } from "../../redux/posts/post.thunk";
import { setFilter } from "../../redux/posts/postSlice";
import { delToken } from "../../api/axios";
import { localLogOut } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import { LanguageSwitcher } from "../LangSwitcher/LangSwitcher";
import { useTranslation } from "react-i18next";

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRefresh = async () => {
    setVisibleNav(false);
    navigate("/");
    dispatch(setFilter(""));
    const { payload } = await dispatch(fetchPosts({}));
    if (payload === "Not authorized") {
      delToken();
      dispatch(localLogOut());
      toast.error(`${t("session-expired-alert")}`);
      navigate("/login");
    }
  };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <button className={styles.logo} type="button" onClick={handleRefresh}>
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
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
