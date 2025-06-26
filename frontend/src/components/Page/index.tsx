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
  bannerSaleContentEN,
  bannerSubscriptionContentEN,
  bannerSaleContentUA,
  bannerSubscriptionContentUA,
} from "../../constants/banner-content.constant";
import { getDateForSale } from "../../helpers/getDateForSale";
import { userSubscriptionConst } from "../../constants/user.constants";
import { useTheme } from "../../helpers/darkModeContext";

interface PageProps {
  children: React.ReactNode;
}

const Page = ({ children }: PageProps) => {
  const { pathname } = useLocation();
  const user = useAppSelector(selectUser);
  const [dateForSale, setDateForSale] = useState<number>(1);
  const { locale } = useTheme();

  useEffect(() => {
    if (user?.subscription === userSubscriptionConst.SALE) {
      const fetchDate = async () => {
        const result = await getDateForSale();
        setDateForSale(result);
      };
      fetchDate();
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  return (
    <div className={styles.page}>
      <Header />
      {!user?.isBlocked && (
        <>
          {user &&
            user.subscription === userSubscriptionConst.FREE &&
            !user.lastPayedStatus && (
              <SubscriptionBanner
                text={
                  locale === "UA"
                    ? bannerSubscriptionContentUA
                    : bannerSubscriptionContentEN
                }
              />
            )}
          {user &&
            user.subscription === userSubscriptionConst.SALE &&
            !user.lastPayedStatus && (
              <SubscriptionBanner
                text={
                  locale === "UA"
                    ? `Насолоджуйся <span>${
                        dateForSale * 24
                      } годинами Преміум-доступу</span> ${bannerSaleContentUA}`
                    : ` Enjoy <span>${
                        dateForSale * 24
                      } hours of Premium Access</span> ${bannerSaleContentEN}`
                }
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
