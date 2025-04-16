import styles from "./SubscriptionBanner.module.sass";

const SubscriptionBanner = ({ text }: { text: string }) => {
  return (
    <div className={styles.subscriptionbanner}>
      <div className={styles.marquee}>
        {Array.from({ length: 4 }).map((_, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionBanner;
