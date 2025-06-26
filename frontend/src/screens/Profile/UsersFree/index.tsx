import { SetStateAction, useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { UserProfile } from "../../../types/auth.types";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface UserProps {
  className: string;
  user: UserProfile;
  setDate: React.Dispatch<SetStateAction<Date>>;
}

const UserFree = ({ className, user, setDate }: UserProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  const SubmitPayment = () => {
    const currentDate = new Date();
    setDate(currentDate);
    navigate("/payment");
  };

  return (
    <>
      <div className={cn(styles.user, className)}>
        <p className={styles.name}>{t("profile.title")}</p>
        <div className={styles.container}>
          <div className={styles.info}>
            <p className={styles.info__text}>
              {t("profile.name")}
              <span>{user.name}</span>
            </p>
            <p className={styles.info__text}>
              {t("profile.email")}
              <span>{user.email}</span>
            </p>
            <p className={styles.info__text}>
              {t("profile.phone")}
              <span>{user.phone}</span>
            </p>
            <p className={styles.info__text}>
              {t("profile.sub")}
              <span>{user.subscription}</span>
            </p>
            {user.isBlocked && (
              <p className={styles.info__text}>
                {t("profile.ban-start")}
                <span className={cn(styles.info__text, [styles.declined])}>
                  {t("profile.ban-end")}
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
                  {t("profile.payed-status")}
                  <span>{user.lastPayedStatus}</span>
                </p>
                <p className={styles.info__text}>
                  {t("profile.payed-date")}
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
              <span>{t("profile.edit-title")}</span>
              <Icon title="image" size={16} />
            </Link>

            <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => setVisibleModalReport(true)}
            >
              <span>{t("profile.report-btn")}</span>
              <Icon title="report" size={18} />
            </button>
          </div>
        </div>
        {!user.lastPayedStatus && !user.isBlocked && (
          <div className={styles.subscription}>
            <p> {t("profile.download-info")}</p>
            <button
              className={cn("button", styles.button)}
              type="button"
              onClick={SubmitPayment}
            >
              {t("profile.download-get-pass")}
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
              {t("profile.decline-warn")}
            </p>
            <p className={styles.declined__text}>{t("profile.decline-info")}</p>
            <p className={styles.declined__text}>
              {t("profile.decline-info-next")}
            </p>
          </div>
        )}

        <div className={styles.note}>
          {t("profile.member-since")}
          {moment(new Date(user.createdAt)).format("DD-MM-yyyy")}
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
