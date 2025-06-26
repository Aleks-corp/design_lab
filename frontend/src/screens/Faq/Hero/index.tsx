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
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../helpers/darkModeContext";

const Hero = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { t } = useTranslation();
  const { locale } = useTheme();
  const options = faqs.map((i) => i.title[(locale as "EN", "UA")]);
  const [visibleModalReport, setVisibleModalReport] = useState(false);

  const [direction, setDirection] = useState<string>(options[0]);

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <div className={styles.stage}>{t("faq.sub-title")}</div>
            <h1 className={cn("h2", styles.title)}>{t("faq.title")}</h1>
            <div className={styles.info}>
              {t("faq.text")}
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setVisibleModalReport(true);
                  } else {
                    toast.error(`${t("faq.login-alert")}`);
                  }
                }}
              >
                {t("faq.text-btn")}
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
                      [styles.active]:
                        x.title[(locale as "EN", "UA")] === direction,
                    })}
                    onClick={() =>
                      setDirection(x.title[(locale as "EN", "UA")])
                    }
                    key={index}
                  >
                    <Icon title={x.icon} size={16} />
                    <span>{x.title[(locale as "EN", "UA")]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.col}>
              {faqs
                .find((i) => i.title[(locale as "EN", "UA")] === direction)
                ?.items.map((i, index) => (
                  <Item
                    className={styles.item}
                    title={i.title[(locale as "EN", "UA")]}
                    description={i.description[(locale as "EN", "UA")]}
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
