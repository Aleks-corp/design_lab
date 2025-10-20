import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logOut } from "../../../redux/auth/auth.thunk";
import { selectUser } from "../../../redux/selectors";
import { useTheme } from "../../../helpers/darkModeContext";

const items = [
  {
    title: { EN: "My profile", UA: "Мій профіль" },
    icon: "user",
    url: "/profile",
  },
  // {
  //   title: {EN:"My favorites posts", UA:"Мої вподобайки"},
  //   icon: "image",
  //   url: "/?filter=favorites",
  // },
  {
    title: { EN: "Dark theme", UA: "Темна тема" },
    icon: "bulb",
  },
  {
    title: { EN: "Sign Out", UA: "Вийти" },
    icon: "exit",
    url: "logout",
  },
];

export interface UserNavProps {
  className?: string;
  setVisibleNav: () => void;
}

const User = ({ className, setVisibleNav }: UserNavProps) => {
  const user = useAppSelector(selectUser);
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { locale } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await dispatch(logOut());
    setVisible(!visible);
    setVisibleNav();
    navigate("/");
  };

  return (
    <div ref={dropdownRef} className={cn(styles.user, className)}>
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        <div className={styles.avatar}>
          <img src="/images/user.png" alt="Avatar" />
        </div>
        <div className={styles.wallet}>
          <span className={styles.currency}>{user?.name}</span>
        </div>
      </div>
      {visible && (
        <div className={styles.body}>
          <div className={styles.name}>{user?.name}</div>
          <div className={styles.code}>
            <div className={styles.number}>{user?.email}</div>
            <button
              className={styles.copy}
              onClick={() => {
                setVisible(!visible);
                setVisibleNav();
              }}
            >
              <Icon title="copy" size={16} />
            </button>
          </div>
          {user?.subscription === "admin" && (
            <div className={styles.wrap}>
              <button
                className={cn("button-stroke button-small", styles.button)}
                onClick={() => {
                  navigate("/unpublished-post");
                  setVisible(!visible);
                  setVisibleNav();
                }}
              >
                Unpublished
              </button>
            </div>
          )}
          <div className={styles.menu}>
            {items.map((i, index) =>
              i.url ? (
                i.url.endsWith("logout") ? (
                  <button
                    type="button"
                    className={styles.item}
                    onClick={logoutHandler}
                    key={index}
                  >
                    <div className={styles.icon}>
                      <Icon title={i.icon} size={20} />
                    </div>
                    <div className={styles.text}>
                      {i.title[locale as "EN" | "UA"]}
                    </div>
                  </button>
                ) : (
                  <Link
                    className={styles.item}
                    to={i.url}
                    onClick={() => {
                      setVisible(!visible);
                      setVisibleNav();
                    }}
                    key={index}
                  >
                    <div className={styles.icon}>
                      <Icon title={i.icon} size={20} />
                    </div>
                    <div className={styles.text}>
                      {i.title[locale as "EN" | "UA"]}
                    </div>
                  </Link>
                )
              ) : (
                <div className={styles.item} key={index}>
                  <div className={styles.icon}>
                    <Icon title={i.icon} size={20} />
                  </div>
                  <div className={styles.text}>
                    {i.title[locale as "EN" | "UA"]}
                  </div>
                  <Theme className={styles.theme} />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
