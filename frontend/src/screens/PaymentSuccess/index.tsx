import { useEffect, useState } from "react";
import styles from "./PaymentSuccess.module.sass";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { checkPaymentStatus } from "../../redux/auth/auth.thunk";
import { selectUser } from "../../redux/selectors";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState("Checking");
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await dispatch(checkPaymentStatus());
      if (response.payload) {
        setStatus(response.payload.subscription);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <div>
      {status === "Checking" && (
        <h2 className={styles.title}>{t("payment.check")}</h2>
      )}
      {status === "member" && (
        <h2 className={styles.title}>{t("payment.check-success")}</h2>
      )}
      {(status === "free" || status === null) && (
        <h2 className={styles.title}>
          {t("payment.check-not-success")}
          <NavLink className={styles.titlelink} to="/profile">
            {t("payment.check-not-success-str")}
          </NavLink>
        </h2>
      )}
      {(status === "member" || user?.subscription === "member") && (
        <NavLink className={styles.titlelink} to="/">
          {t("payment.go-to")}
        </NavLink>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
