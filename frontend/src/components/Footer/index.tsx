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

const Footers = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("You have successfully subscribed to our newsletter!");
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
            <div className={styles.info}>The New Creative Economy</div>
            <div className={styles.version}>
              <div className={styles.details}>Dark theme</div>
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
            <div className={styles.category}>Join Newsletter</div>
            <div className={styles.text}>
              Subscribe our newsletter to get more design course and resource
            </div>
            <Form
              className={styles.form}
              value={email}
              setValue={setEmail}
              onSubmit={(e) => handleSubmit(e)}
              placeholder="Enter your email"
              type="email"
              name="email"
            />
          </div>
        </div>
        <div className={styles.foot}>
          <div className={styles.copyright}>
            Copyright © 2024 ACITS GROUP. All rights reserved
          </div>
          <div className={styles.note}>We use cookies for better service.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
