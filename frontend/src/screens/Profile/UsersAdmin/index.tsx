import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";

import { UserProfile } from "../../../types/auth.types";
import { Link } from "react-router-dom";
import moment from "moment";

interface UserProps {
  className: string;
  user: UserProfile;
}

const UserAdmin = ({ className, user }: UserProps) => {
  return (
    <>
      <div className={cn(styles.user, className)}>
        {/* <div className={styles.avatar}>
          <img src="/images/content/avatar-big.jpg" alt="Avatar" />
        </div> */}
        <div className={styles.name}>{user.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>{user.email}</div>
          {/* <button className={styles.copy}>
            <Icon title="copy" size={16} />
          </button> */}
        </div>
        <div className={styles.info}>
          <p>Subscription - {user.subscription}</p>

          <Link
            className={cn("button-stroke button-small", styles.button)}
            to="/admin/users"
          >
            <span>View users subscription</span>
            <Icon title="image" size={16} />
          </Link>
          <Link
            className={cn("button-stroke button-small", styles.button)}
            to="/unpublished-post"
          >
            <span>View unpublished posts</span>
            <Icon title="image" size={16} />
          </Link>
        </div>

        <div className={styles.control}>
          <div className={styles.btns}>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/profile-edit"
            >
              <span>Edit profile</span>
              <Icon title="image" size={16} />
            </Link>
          </div>
        </div>

        <div className={styles.note}>
          Member since {moment(new Date(user.createdAt)).format("DD-MM-yyyy")}
        </div>
      </div>
    </>
  );
};

export default UserAdmin;
