import cn from "classnames";
import styles from "./PassChangeForm.module.sass";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../redux/auth/auth.thunk";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { selectIsLogining, selectUserError } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { getChangePassSchema } from "../../schema/regSchema";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confpass: string;
};

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { locale } = useTheme();
  const schema = getChangePassSchema(locale as "EN" | "UA");
  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectIsLogining);

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { oldPassword, newPassword } = data;
    await dispatch(changePassword({ oldPassword, newPassword }));
    if (error) {
      return;
    } else {
      reset();
      navigate("/signin");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.category}>{t("passchange.form-title")}</div>
          <div className={styles.fieldset}>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("oldPassword")}
                label={t("passchange.oldpass-label")}
                name="oldPassword"
                type={showPass ? "text" : "password"}
                placeholder={t("passchange.pass-placeholder")}
                required
              />
              <button
                className={styles.showpass}
                type="button"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <Icon title="eye-open" size={24} />
                ) : (
                  <Icon title="eye-closed" size={24} />
                )}
              </button>
              {errors?.oldPassword && (
                <p className={styles.errorpass}>{errors.oldPassword.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("newPassword")}
                label={t("passchange.oldpass-label")}
                name="newPassword"
                type={showPass ? "text" : "password"}
                placeholder={t("passchange.pass-placeholder")}
                required
              />
              <button
                className={styles.showpass}
                type="button"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <Icon title="eye-open" size={24} />
                ) : (
                  <Icon title="eye-closed" size={24} />
                )}
              </button>
              {errors?.newPassword && (
                <p className={styles.errorpass}>{errors.newPassword.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("confpass")}
                label={t("passchange.confirmpass-label")}
                name="password"
                type={showConfPass ? "text" : "password"}
                placeholder={t("passchange.pass-placeholder")}
                required
              />
              <button
                className={styles.showpass}
                type="button"
                onClick={() => setShowConfPass(!showConfPass)}
              >
                {showConfPass ? (
                  <Icon title="eye-open" size={24} />
                ) : (
                  <Icon title="eye-closed" size={24} />
                )}
              </button>
              {errors?.confpass && (
                <p className={styles.errorpass}>{errors.confpass.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btns}>
        <button type="submit" className={cn("button", styles.button)}>
          {isLoading ? <Loader className="" /> : t("passchange.submit-btn")}
        </button>
        <button type="reset" className={styles.clear}>
          <Icon title="circle-close" size={24} />
          {t("passchange.reset-btn")}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
