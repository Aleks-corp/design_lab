import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import { ClassNameProps } from "../../../types/className.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { logOut } from "../../../redux/auth/auth.thunk";
import { selectUser } from "../../../redux/selectors";

const items = [
  {
    title: "My profile",
    icon: "user",
    url: "/profile",
  },
  {
    title: "My favorites posts",
    icon: "image",
    url: "/?filter=favorites",
  },
  {
    title: "Dark theme",
    icon: "bulb",
  },
  {
    title: "Sign Out",
    icon: "exit",
    url: "logout",
  },
];

const User = ({ className }: ClassNameProps) => {
  const user = useAppSelector(selectUser);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await dispatch(logOut());
    navigate("/");
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
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
              <button className={styles.copy}>
                <Icon title="copy" size={16} />
              </button>
            </div>
            <div className={styles.wrap}>
              <button
                className={cn("button-stroke button-small", styles.button)}
                onClick={() => navigate("/profile-edit")}
              >
                Edit Profile
              </button>
            </div>
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
                      <div className={styles.text}>{i.title}</div>
                    </button>
                  ) : (
                    <Link
                      className={styles.item}
                      to={i.url}
                      onClick={() => setVisible(!visible)}
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon title={i.icon} size={20} />
                      </div>
                      <div className={styles.text}>{i.title}</div>
                    </Link>
                  )
                ) : (
                  <div className={styles.item} key={index}>
                    <div className={styles.icon}>
                      <Icon title={i.icon} size={20} />
                    </div>
                    <div className={styles.text}>{i.title}</div>
                    <Theme className={styles.theme} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default User;
