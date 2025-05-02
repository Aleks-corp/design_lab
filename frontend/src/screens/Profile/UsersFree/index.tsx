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
        <p className={styles.name}>Profile</p>
        <div className={styles.container}>
          <div className={styles.info}>
            <p className={styles.info__text}>
              Name: <span>{user.name}</span>
            </p>
            <p className={styles.info__text}>
              Email: <span>{user.email}</span>
            </p>
            <p className={styles.info__text}>
              Phone: <span>{user.phone}</span>
            </p>
            <p className={styles.info__text}>
              Subscription - <span>{user.subscription}</span>
            </p>
            {user.isBlocked && (
              <p className={styles.info__text}>
                Your account is{" "}
                <span className={cn(styles.info__text, [styles.declined])}>
                  BANED
                </span>
              </p>
            )}
            {user.lastPayedStatus === "Declined" && user.lastPayedDate && (
              <div className={styles.declined}>
                <p
                  className={cn(styles.info__text, {
                    [styles.declined]: user.lastPayedStatus === "Declined",
                  })}
                >
                  Last payed status - <span>{user.lastPayedStatus}</span>
                </p>
                <p className={styles.info__text}>
                  Last payed date -{" "}
                  <span>
                    {moment(new Date(user.lastPayedDate)).format("DD-MM-yyyy")}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className={styles.btns}>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/profile-edit"
            >
              <span>Edit profile</span>
              <Icon title="image" size={16} />
            </Link>

            <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => setVisibleModalReport(true)}
            >
              <span>Report</span>
              <Icon title="report" size={18} />
            </button>
          </div>
        </div>
        {!user.lastPayedStatus && !user.isBlocked && (
          <div className={styles.subscription}>
            <p>Please subscribe for downloading file</p>
            <button
              className={cn("button", styles.button)}
              type="button"
              onClick={SubmitPayment}
            >
              Get All-Access Pass
            </button>
          </div>
        )}
        {user.lastPayedStatus === "Declined" && user.lastPayedDate && (
          <div className={styles.declined}>
            <p
              className={cn(
                styles.declined__text,
                styles.declined__text__alert
              )}
            >
              Unfortunately, your last payment was declined. Please check your
              payment details.
            </p>
            <p className={styles.declined__text}>
              Ensure that your payment credentials are up-to-date and that there
              are sufficient funds in your account.
            </p>
            <p className={styles.declined__text}>
              After a successful payment, refresh the page to see the updated
              status.
            </p>
          </div>
        )}

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
