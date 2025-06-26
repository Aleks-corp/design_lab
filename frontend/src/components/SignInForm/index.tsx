import cn from "classnames";
import styles from "./SignInForm.module.sass";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { logIn } from "../../redux/auth/auth.thunk";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";
import { getLoginSchema } from "../../schema/regSchema";

type FormValues = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLogining);
  const { locale } = useTheme();
  const { t } = useTranslation();
  const schema = getLoginSchema(locale as "EN" | "UA");

  const [showPass, setShowPass] = useState(false);
  const [isntVerify, setIsntVerify] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    const ans = await dispatch(logIn({ email: email.toLowerCase(), password }));
    if (ans?.type === "auth/login/rejected") {
      if (ans.payload.status === 403) {
        setIsntVerify(true);
      }
      return;
    } else {
      setIsntVerify(false);
      reset();
      navigate("/");
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
                hookformprop={register("email")}
                label={t("labels.email")}
                name="Email"
                type="email"
                placeholder={t("placeholders.email")}
              />
              {errors?.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("password")}
                label={t("labels.password")}
                name="password"
                type={showPass ? "text" : "password"}
                placeholder={t("placeholders.password")}
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
            {isntVerify ? (
              <Link to="/resendverify" className={styles.link}>
                {t("login-resend")}
              </Link>
            ) : (
              <Link to="/forgot-password" className={styles.link}>
                {t("login-forgot")}
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className={styles.btns}>
        <button type="submit" className={cn("button", styles.button)}>
          {isLoading ? <Loader className="" /> : "Login"}
        </button>
        <button type="reset" className={styles.clear}>
          <Icon title="circle-close" size={24} />
          {t("passchange.reset-btn")}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
