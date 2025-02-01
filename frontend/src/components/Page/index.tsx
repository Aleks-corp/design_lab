import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./Page.module.sass";
import Header from "../Header";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import SubscriptionBanner from "../SubscriptionBanner";

interface PageProps {
  children: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
  const { pathname } = useLocation();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  return (
    <div className={styles.page}>
      <Header />
      {user && user.subscription === "free" && <SubscriptionBanner />}
      <div className={styles.inner}>{children}</div>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Page;
