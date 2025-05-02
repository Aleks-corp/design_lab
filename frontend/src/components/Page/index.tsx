import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import styles from "./Page.module.sass";
import Header from "../Header";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import SubscriptionBanner from "../SubscriptionBanner";
import {
  bannerSaleContent,
  bannerSubscriptionContent,
} from "../../constants/banner-content.constant";
import { getDateForSale } from "../../helpers/getDateForSale";

interface PageProps {
  children: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
  const { pathname } = useLocation();
  const user = useAppSelector(selectUser);
  const [dateForSale, setDateForSale] = useState<number>(1);

  useEffect(() => {
    const fetchDate = async () => {
      const result = await getDateForSale();
      setDateForSale(result);
    };

    fetchDate();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  return (
    <div className={styles.page}>
      <Header />
      {!user?.isBlocked && (
        <>
          {user && user.subscription === "free" && !user.lastPayedStatus && (
            <SubscriptionBanner text={bannerSubscriptionContent} />
          )}
          {user && user.subscription === "sale" && !user.lastPayedStatus && (
            <SubscriptionBanner
              text={` Enjoy <span>${
                dateForSale * 24
              } hours of Premium Access</span> ${bannerSaleContent}`}
            />
          )}
        </>
      )}

      <div className={styles.inner}>{children}</div>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Page;
