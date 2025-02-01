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
    const checkPayment = async () => {
      const data = await dispatch(checkPaymentStatus());
      setStatus(
        data.payload.subscription === "member"
          ? "Payment Successful! Access to files is open."
          : "Payment Unsuccessful("
      );
    };
    checkPayment();
  }, [dispatch]);

  return (
    <div>
      <h2 className={styles.title}>{status}</h2>
      {user && user.subscription === "member" && (
        <NavLink className={styles.titlelink} to="/">
          Go to Posts
        </NavLink>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
