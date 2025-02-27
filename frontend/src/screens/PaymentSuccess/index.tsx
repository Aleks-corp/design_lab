import { useEffect, useState } from "react";
import styles from "./PaymentSuccess.module.sass";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { checkPaymentStatus } from "../../redux/auth/auth.thunk";
import { selectUser } from "../../redux/selectors";
import { NavLink } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState("Перевіряємо оплату...");
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const response = await dispatch(checkPaymentStatus());
      if (response.payload) {
        setStatus(response.payload.subscription);
      }
      console.log("response.payload.subscription:", response.payload);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <div>
      {status === "Перевіряємо оплату..." && (
        <h2 className={styles.title}>{status}</h2>
      )}
      {status === "member" && (
        <h2 className={styles.title}>
          Payment Successful! Access to files is open.
        </h2>
      )}
      {(status === "free" || status === null) && (
        <h2 className={styles.title}>
          No payment yet. Please wait a few minutes and reload page or contact
          our{" "}
          <NavLink className={styles.titlelink} to="/profile">
            support
          </NavLink>
        </h2>
      )}
      {(status === "member" || user?.subscription === "member") && (
        <NavLink className={styles.titlelink} to="/">
          Go to Posts
        </NavLink>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
