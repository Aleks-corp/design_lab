import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
// import Icon from "../Icon";
import Image from "../Image";
// import Notification from "./Notification";
import User from "./User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsAdmin, selectIsLoggedIn } from "../../redux/selectors";
import { fetchPosts } from "../../redux/posts/post.thunk";
import { setFilter } from "../../redux/posts/postSlice";

const Headers = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const [search, setSearch] = useState("");

  // const handleSubmit = () => {
  //   alert();
  // };

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <button
          className={styles.logo}
          type="button"
          onClick={() => {
            setVisibleNav(false);
            navigate("/");
            dispatch(fetchPosts({}));
            dispatch(setFilter(""));
          }}
        >
          <Image
            className={styles.pic}
            src="/images/logo-dark.png"
            srcDark="/images/logo-light.png"
            alt="Fitness Pro"
          />
        </button>
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
            <User
              className={styles.user}
              setVisibleNav={() => setVisibleNav(false)}
            />
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
