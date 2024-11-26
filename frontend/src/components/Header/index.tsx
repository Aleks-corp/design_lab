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

const nav = [
  // {
  // url: "/search01",
  // title: "Discover",
  // },
  // {
  //   url: "/faq",
  //   title: "How it work",
  // },
  // {
  //   url: "/item",
  //   title: "Create item",
  // },
  {
    url: "/profile",
    title: "Profile",
  },
];

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
        <Link className={styles.logo} to="/">
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
          />
        </Link>
        <div
          className={cn(styles.wrapper, {
            [styles.active]: visibleNav,
          })}
        >
          <nav className={styles.nav}>
            {nav.map((i, index) => (
              <Link className={styles.link} to={i.url} key={index}>
                {i.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* <Notification className={styles.notification} /> */}

        {isAdmin && (
          <Link className={cn("button-small", styles.button)} to="/upload-post">
            Upload
          </Link>
        )}
        {!isLoggedIn ? (
          <>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/register"
            >
              Sign Up
            </Link>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/login"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            <User className={styles.user} />
            <button
              className={cn(styles.burger, {
                [styles.active]: visibleNav,
              })}
              onClick={() => setVisibleNav(!visibleNav)}
            ></button>
          </>
        )}
      </div>
    </header>
  );
};

export default Headers;
