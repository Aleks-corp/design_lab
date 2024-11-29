import { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
// import Icon from "../Icon";
import Image from "../Image";
// import Notification from "./Notification";
import User from "./User";
import { useAppSelector } from "../../redux/hooks";
import { selectIsAdmin, selectIsLoggedIn } from "../../redux/selectors";

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);

  // const [search, setSearch] = useState("");

  // const handleSubmit = () => {
  //   alert();
  // };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link
          className={styles.logo}
          to="/"
          onClick={() => setVisibleNav(false)}
        >
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
          />
        </Link>
        <div className={styles.wrapper}>
          {/* <nav className={styles.nav}>
            <Link className={styles.link} to={user ? "/profile" : ""}>
              Profile
            </Link>
          </nav> */}
        </div>

        {/* <Notification className={styles.notification} /> */}

        {isAdmin && (
          <Link className={cn("button-small", styles.button)} to="/upload-post">
            Upload
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
              Sign Up
            </Link>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/login"
              onClick={() => setVisibleNav(false)}
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div
            className={cn(styles.sign, {
              [styles.active]: visibleNav,
            })}
          >
            <User className={styles.user} />
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
