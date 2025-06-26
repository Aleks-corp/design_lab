import cn from "classnames";
import styles from "./AccessPass.module.sass";
import { UserProfile } from "../../types/auth.types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SetStateAction } from "react";
import { useTranslation } from "react-i18next";

const AccessPass = ({
  user,
  setDate,
}: {
  user: UserProfile | null;
  setDate: React.Dispatch<SetStateAction<Date>>;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const SubmitPayment = () => {
    const currentDate = new Date();
    setDate(currentDate);
    navigate("/payment");
  };
  const NavReg = () => {
    toast.error(`${t("login-first-alert")}`);
    navigate("/register");
  };
  return (
    <div className={styles.info}>
      <p className={styles.text}>{t("download-with-Access-Pass")}</p>
      <button
        className={cn("button", styles.button)}
        type="button"
        onClick={() => (user ? SubmitPayment() : NavReg())}
      >
        {t("get-Access-Pass-btn")}
      </button>
    </div>
  );
};

export default AccessPass;
