// import { useState } from "react";
import cn from "classnames";
import styles from "./Profile.module.sass";
import UserMember from "./UsersMember";
import UserAdmin from "./UsersAdmin";
import UserFree from "./UsersFree";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";

const Profile = () => {
  const user = useAppSelector(selectUser);

  return (
    user && (
      <div className={styles.profile}>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            {user.subscription === "free" && (
              <UserFree className={styles.user} user={user} />
            )}
            {user.subscription === "member" && (
              <UserMember className={styles.user} user={user} />
            )}
            {user.subscription === "admin" && (
              <UserAdmin className={styles.user} user={user} />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
