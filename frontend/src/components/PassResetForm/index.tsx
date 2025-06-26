import cn from "classnames";
import styles from "./PassResetForm.module.sass";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { setNewPassword } from "../../redux/auth/auth.thunk";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { selectIsLogining, selectUserError } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";
import { getResetPassSchema } from "../../schema/regSchema";

type FormValues = {
  password: string;
  confpass: string;
};

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useTheme();
  const schema = getResetPassSchema(locale as "EN" | "UA");
  const { newPassToken = "" } = useParams();
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
    const { password } = data;
    await dispatch(setNewPassword({ password, newPassToken }));
    if (error) {
      return;
    } else {
      reset();
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.category}>{t("passchange.forgot-title")}</div>
          <div className={styles.fieldset}>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("password")}
                label={t("passchange.newpass-label")}
                name="password"
                type={showPass ? "text" : "password"}
                placeholder={t("placeholders.password")}
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
              {errors?.password && (
                <p className={styles.errorpass}>{errors.password.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("confpass")}
                label={t("passchange.confirmpass-label")}
                name="password"
                type={showConfPass ? "text" : "password"}
                placeholder={t("placeholders.password")}
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
          {isLoading ? <Loader className="" /> : t("passchange.set-new-btn")}
        </button>
        <button type="reset" className={styles.clear}>
          <Icon title="circle-close" size={24} />
          {t("passchange.reset-btn")}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
