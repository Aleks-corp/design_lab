// import { useState } from "react";
import cn from "classnames";
import styles from "./Profile.module.sass";
import UserMember from "./UsersMember";
import UserAdmin from "./UsersAdmin";
import UserFree from "./UsersFree";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import { SetStateAction } from "react";

const Profile = ({
  setDate,
}: {
  setDate: React.Dispatch<SetStateAction<Date>>;
}) => {
  const user = useAppSelector(selectUser);

  return (
    user && (
      <div className={styles.profile}>
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            {user.subscription === "free" && (
              <UserFree className={styles.user} user={user} setDate={setDate} />
            )}
            {user.subscription === "member" && (
              <UserMember
                className={styles.user}
                user={user}
                setDate={setDate}
              />
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
