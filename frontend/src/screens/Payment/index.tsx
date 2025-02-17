import { useState } from "react";
import cn from "classnames";
import styles from "./Payment.module.sass";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import { handleWayForPay } from "../../helpers/wayforpay";

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector(selectUser);

  const handlePayment = async () => {
    setLoading(true);
    if (user) {
      await handleWayForPay(user);
    }
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Subscription Registration</h2>
      <p className={styles.subtitle}>Recurring Payment Details</p>
      <p className={styles.text}>
        Amount: <span> $5 USD</span>
      </p>
      <p className={styles.text}>
        Frequency: <span> Monthly</span>
      </p>
      {user && (
        <button
          className={cn("button", styles.titlelink)}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Wait..." : "WayForPay"}
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
