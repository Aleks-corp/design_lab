import { SetStateAction, useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { UserProfile } from "../../../types/auth.types";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAppDispatch } from "../../../redux/hooks";
import { unsubscribe } from "../../../redux/auth/auth.thunk";

interface UserProps {
  className: string;
  user: UserProfile;
  setDate: React.Dispatch<SetStateAction<Date>>;
}

const UserMember = ({ className, user, setDate }: UserProps) => {
  const dispatch = useAppDispatch();
  const [visibleModalReport, setVisibleModalReport] = useState(false);
  const navigate = useNavigate();

  const SubmitPayment = () => {
    const currentDate = new Date();
    if (currentDate.getTime() > new Date(user.subend).getTime()) {
      setDate(currentDate);
    } else {
      setDate(user.subend);
    }
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
            <p className={styles.info__text}>
              Subscription status - <span>{user.status}</span>
            </p>
            {user.lastPayedStatus && user.lastPayedDate && (
              <>
                <p
                  className={cn(styles.info__text, {
                    [styles.aproved]: user.lastPayedStatus === "Approved",
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
              </>
            )}
            {user.status !== "Active" && (
              <p className={styles.info__text}>
                Subscription until -{" "}
                <span>
                  {moment(new Date(user.subend)).format("DD-MM-yyyy")}
                </span>
              </p>
            )}
            {user.status === "Active" && (
              <p className={styles.info__text}>
                Next payment -{" "}
                <span>
                  {moment(new Date(user.subend)).format("DD-MM-yyyy")}
                </span>
              </p>
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
            {user.status === "Active" && (
              <button
                className={cn("button-stroke button-small", styles.button)}
                onClick={() => dispatch(unsubscribe())}
              >
                Unsubscribe
              </button>
            )}
            {user.status !== "Active" && (
              <button
                className={cn("button", styles.button)}
                type="button"
                onClick={SubmitPayment}
              >
                Resubscribe
              </button>
            )}
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
