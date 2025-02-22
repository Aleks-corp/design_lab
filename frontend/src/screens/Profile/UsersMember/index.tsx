import { useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { UserProfile } from "../../../types/auth.types";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAppDispatch } from "../../../redux/hooks";
import { unsubscribe } from "../../../redux/auth/auth.thunk";

interface UserProps {
  className: string;
  user: UserProfile;
}

const UserMember = ({ className, user }: UserProps) => {
  const dispatch = useAppDispatch();
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.name}>Name: {user.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>Email: {user.email}</div>
        </div>
        <div className={styles.info}>
          <p>
            <span>Subscription</span> - All Access Pass
          </p>
          <p>
            <span>Subscription status</span> - {user.status}
          </p>
          <p>
            <span>Next payment</span> -{" "}
            {moment(new Date(user.subend)).format("DD-MM-yyyy")}
          </p>
          {user.status === "Active" && (
            <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => dispatch(unsubscribe())}
            >
              Unsubscribe
            </button>
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
          Member since {moment(new Date(user.createdAt)).format("DD-MM-yyyy")}
        </div>
      </div>
      <Modal
        visible={visibleModalReport}
        onClose={() => setVisibleModalReport(false)}
      >
        <Report onClose={() => setVisibleModalReport(false)} />
      </Modal>
    </>
  );
};

export default UserMember;
