// import { useState } from "react";
import cn from "classnames";
import styles from "./Profile.module.sass";
import User from "./Users";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";

const Profile = () => {
  const user = useAppSelector(selectUser);

  return (
    user && (
      <div className={styles.profile}>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <User className={styles.user} user={user} />
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
