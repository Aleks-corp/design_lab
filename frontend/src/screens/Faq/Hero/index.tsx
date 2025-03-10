import { useState } from "react";
import cn from "classnames";
import styles from "./Hero.module.sass";
import Dropdown from "../../../components/Dropdown";
import Icon from "../../../components/Icon";
import Item from "./Item";
import { faqs } from "../../../constants/faq.constant";
import Report from "../../../components/Report";
import Modal from "../../../components/Modal";
import { useAppSelector } from "../../../redux/hooks";
import { selectIsLoggedIn } from "../../../redux/selectors";
import toast from "react-hot-toast";

const Hero = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const options = faqs.map((i) => i.title);
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  const [direction, setDirection] = useState<string>(options[0]);

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <div className={styles.stage}>learn how to get started</div>
            <h1 className={cn("h2", styles.title)}>
              Frequently asked questions
            </h1>
            <div className={styles.info}>
              Find answers to your questions or{" "}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setVisibleModalReport(true);
                  } else {
                    toast.error("Please LogIn first");
                  }
                }}
              >
                Contact Support
              </button>
            </div>
            <Dropdown
              className={cn("mobile-show", styles.dropdown)}
              value={direction}
              setValue={setDirection}
              options={options}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.nav}>
                {faqs.map((x, index) => (
                  <div
                    className={cn(styles.link, {
                      [styles.active]: x.title === direction,
                    })}
                    onClick={() => setDirection(x.title)}
                    key={index}
                  >
                    <Icon title={x.icon} size={16} />
                    <span>{x.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.col}>
              {faqs
                .find((i) => i.title === direction)
                ?.items.map((i, index) => (
                  <Item
                    className={styles.item}
                    title={i.title}
                    description={i.description}
                    key={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={visibleModalReport}
        onClose={() => setVisibleModalReport(false)}
      >
        <Report onClose={() => setVisibleModalReport(false)} />
      </Modal>
    </>
  );
};

export default Hero;
