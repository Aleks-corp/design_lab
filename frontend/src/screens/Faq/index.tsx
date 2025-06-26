import Control from "../../components/Control";
import { faqBreadcrumbs } from "../../constants/breadcrumbs.constants";
import styles from "./Faq.module.sass";
import Hero from "./Hero";

const Faq = () => {
  return (
    <>
      <Control className={styles.control} item={faqBreadcrumbs} />
      <Hero />
    </>
  );
};

export default Faq;
