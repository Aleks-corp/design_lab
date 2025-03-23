import { SetStateAction, useState } from "react";
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
  setDate: React.Dispatch<SetStateAction<Date>>;
}

const UserFree = ({ className, user, setDate }: UserProps) => {
  const navigate = useNavigate();
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  const SubmitPayment = () => {
    const currentDate = new Date();
    setDate(currentDate);
    navigate("/payment");
  };

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.name}>Name: {user.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>Email: {user.email}</div>
        </div>
        <div className={styles.code}>
          <div className={styles.number}>Phone: {user.phone}</div>
        </div>
        <div className={styles.info}>
          <p>Subscription - {user.subscription}</p>

          <p>Please subscribe for downloading file</p>
          <button
            className={cn("button", styles.button)}
            type="button"
            onClick={SubmitPayment}
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
        <Report onClose={() => setVisibleModalReport(false)} />
      </Modal>
    </>
  );
};

export default UserFree;
