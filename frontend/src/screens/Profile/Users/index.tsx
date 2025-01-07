import { useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { UserProfile } from "../../../types/auth.types";
import { Link } from "react-router-dom";
import moment from "moment";

interface UserProps {
  className: string;
  user: UserProfile;
}

const User = ({ className, user }: UserProps) => {
  const [visibleModalReport, setVisibleModalReport] = useState(false);

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
          {user.subscription === "free" && (
            <p>Please subscribe for downloading file</p>
          )}
          {user.subscription === "member" && (
            <p>
              Subscription until {format(new Date(user.subend), "dd-MM-yyyy")}
            </p>
          )}
          {user.subscription === "admin" && (
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/admin/users"
            >
              <span>View users subscription</span>
              <Icon title="image" size={16} />
            </Link>
          )}
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

            <button
              className={cn("button-circle-stroke button-small", styles.button)}
              onClick={() => setVisibleModalReport(true)}
            >
              <Icon title="report" size={20} />
            </button>
          </div>
        </div>

        <div className={styles.note}>
          Member since {moment(new Date(user.createdAt)).format("dd-MM-yyyy")}
        </div>
      </div>
      <Modal
        visible={visibleModalReport}
        onClose={() => setVisibleModalReport(false)}
      >
        <Report />
      </Modal>
    </>
  );
};

export default User;
