import Control from "../../components/Control";
import styles from "./Faq.module.sass";
import Hero from "./Hero";

const Faq = () => {
  const breadcrumbs = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "FAQ",
    },
  ];
  return (
    <>
      <Control className={styles.control} item={breadcrumbs} />
      <Hero />
    </>
  );
};

export default Faq;
