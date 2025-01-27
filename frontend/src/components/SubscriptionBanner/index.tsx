import styles from "./SubscriptionBanner.module.sass";

const SubscriptionBanner = () => {
  return (
    <div className={styles.subscriptionbanner}>
      <div className={styles.marquee}>
        <p>
          Get <span>full access</span> to download files and enjoy all features
          by <span>purchasing a subscription</span> today!
        </p>
        <p>
          Get <span>full access</span> to download files and enjoy all features
          by <span>purchasing a subscription</span> today!
        </p>
        <p>
          Get <span>full access</span> to download files and enjoy all features
          by <span>purchasing a subscription</span> today!
        </p>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
