import "react-phone-number-input/style.css";
import cn from "classnames";
import styles from "./SignUpForm.module.sass";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../redux/auth/auth.thunk";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { getRegSchema } from "../../schema/regSchema";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import PhoneInput from "../../components/PhoneInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confpass: string;
};

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLogining);
  const { locale } = useTheme();
  const { t } = useTranslation();
  const schema = getRegSchema(locale as "EN" | "UA");

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, email, phone, password } = data;
    const cleanedPhone = phone.replace("+", "");

    try {
      const res = await dispatch(
        signUp({
          name,
          email: email.toLowerCase(),
          phone: cleanedPhone,
          password,
        })
      ).unwrap();
      if (!("ok" in res) || res.ok !== true) {
        throw new Error(res?.message || "Помилка реєстрації.");
      }
      navigate("/verify/0");
      reset();
    } catch (err) {
      console.error("Registration failed", err);
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
                hookformprop={register("name")}
                label={t("labels.name")}
                name="Name"
                type="text"
                placeholder={t("placeholders.name")}
                required
              />
              {errors?.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("email")}
                label={t("labels.email")}
                name="Email"
                type="email"
                placeholder={t("placeholders.email")}
                required
              />
              {errors?.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
              <p className={styles.info}>{t("register-email-info")}</p>
            </div>
            <div className={styles.field}>
              <p className={styles.label}>{t("labels.phone")}</p>
              <PhoneInputWithCountry
                inputComponent={PhoneInput}
                name="phone"
                control={control}
                rules={{ required: true }}
                className={styles.phoneInput}
                international
                defaultCountry="UA"
                maxLength={16}
              />
              {errors?.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <TextInput
                hookformprop={register("password")}
                label={t("labels.password")}
                name="password"
                type={showPass ? "text" : "password"}
                placeholder={t("placeholders.password")}
                required
              />
              <button
                className={styles.showpass}
                type="button"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
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
                label={t("labels.confirm-pass")}
                name="password"
                type={showConfPass ? "text" : "password"}
                placeholder={t("placeholders.password")}
                required
              />
              <button
                className={styles.showpass}
                type="button"
                onClick={() => setShowConfPass(!showConfPass)}
                tabIndex={-1}
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
          {isLoading ? <Loader className="" /> : `${t("register")}`}
        </button>
        <button type="reset" className={styles.clear}>
          <Icon title="circle-close" size={24} />
          {t("passchange.reset-btn")}
        </button>
      </div>
    </form>
  );
};
export default SignUpForm;
