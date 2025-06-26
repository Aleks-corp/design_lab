import { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Footer.module.sass";
import Group from "./Group";
import Image from "../Image";
import Form from "../Form";
import Theme from "../Theme";
import toast from "react-hot-toast";
import { useAppSelector } from "../../redux/hooks";
import { selectIsLoggedIn } from "../../redux/selectors";
import { footerGroupLink } from "../../constants/footerGroup";
import { useTranslation } from "react-i18next";

const Footers = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(`${t("footer.subscription-alert")}`);
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.container)}>
        <div className={styles.row}>
          <div className={styles.col}>
            <Link className={styles.logo} to="/">
              <Image
                className={styles.pic}
                src="/images/logo-dark.png"
                srcDark="/images/logo-light.png"
                alt="Fitness Pro"
              />
            </Link>
            <div className={styles.info}>{t("footer.title")}</div>
            <div className={styles.version}>
              <div className={styles.details}>{t("theme")}</div>
              <Theme className="theme-big" />
            </div>
          </div>
          <div className={styles.col}>
            {isLoggedIn
              ? footerGroupLink.loggedIn.map((x, index) => (
                  <Group className={styles.group} item={x} key={index} />
                ))
              : footerGroupLink.notLoggedIn.map((x, index) => (
                  <Group className={styles.group} item={x} key={index} />
                ))}
          </div>
          <div className={styles.col}>
            <div className={styles.category}>{t("footer.newsletter")}</div>
            <div className={styles.text}>{t("footer.subscription")}</div>
            <Form
              className={styles.form}
              value={email}
              setValue={setEmail}
              onSubmit={(e) => handleSubmit(e)}
              placeholder={t("footer.placeholder")}
              type="email"
              name="email"
            />
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.copyright}>
            Copyright © 2024 ACITS GROUP. All rights reserved
          </div>
          <div className={styles.note}>{t("footer.cookies")}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
