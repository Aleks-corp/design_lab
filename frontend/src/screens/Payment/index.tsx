import { useState } from "react";
import cn from "classnames";
import styles from "./Payment.module.sass";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import { handleWayForPay } from "../../helpers/wayforpay";
import { useTranslation } from "react-i18next";

const PaymentPage = ({ date }: { date: Date }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);

  const handlePayment = async () => {
    setLoading(true);
    if (user) {
      await handleWayForPay(user, date);
    }
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t("payment.title")}</h2>
      <p className={styles.subtitle}>{t("payment.subtitle")}</p>
      <p className={styles.text}>
        {t("payment.ammount-text")}
        <span>{t("payment.ammount-text-str")}</span>
      </p>
      <p className={styles.text}>
        {t("payment.frequency-text")}
        <span>{t("payment.frequency-text-str")}</span>
      </p>
      {user && (
        <button
          className={cn("button", styles.titlelink)}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? t("payment.wait") : "WayForPay"}
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
