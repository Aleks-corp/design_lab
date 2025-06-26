import cn from "classnames";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { editProfileBreadcrumbs } from "../../constants/breadcrumbs.constants";

const ProfileEdit = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <Control className={styles.control} item={editProfileBreadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>
              {t("profile.edit-title")}
            </h1>
            <div className={styles.info}>{t("profile.edit-info")}</div>
          </div>
          <div className={styles.row}>
            {/* <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img src="/images/content/avatar-1.jpg" alt="Avatar" />
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.text}>
                    We recommend an image of at least 400x400. Gifs work too{" "}
                    <span role="img" aria-label="hooray">
                      🙌
                    </span>
                  </div>
                  <div className={styles.file}>
                    <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                    >
                      Upload
                    </button>
                    <input className={styles.load} type="file" />
                  </div>
                </div>
              </div>
            </div> */}
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>
                    {t("passchange.form-title")}
                  </div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label={t("labels.name")}
                      name="Name"
                      type="text"
                      placeholder={t("placeholders.name")}
                      required
                    />
                  </div>
                  <div className={styles.fieldset}>
                    <div className={styles.btns}>
                      <Link
                        className={cn(
                          "button-stroke button-small",
                          styles.button
                        )}
                        to="/change-password"
                      >
                        <span>{t("change-pass")}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.btns}>
                <button className={cn("button", styles.button)}>
                  {t("profile.update-btn")}
                </button>
                <button className={styles.clear}>
                  <Icon title="circle-close" size={24} />
                  {t("passchange.reset-btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
