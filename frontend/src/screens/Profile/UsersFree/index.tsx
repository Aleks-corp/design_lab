import { useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { UserProfile } from "../../../types/auth.types";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

interface UserProps {
  className: string;
  user: UserProfile;
}

const UserFree = ({ className, user }: UserProps) => {
  const navigate = useNavigate();
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>{user.email}</div>
        </div>
        <div className={styles.info}>
          <p>Subscription - {user.subscription}</p>

          <p>Please subscribe for downloading file</p>
          <button
            className={cn("button", styles.button)}
            type="button"
            onClick={() => navigate("/payment")}
          >
            Get All-Access Pass
          </button>
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
        <Report />
      </Modal>
    </>
  );
};

export default UserFree;
