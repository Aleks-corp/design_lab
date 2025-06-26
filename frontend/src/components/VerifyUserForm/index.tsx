import cn from "classnames";
import styles from "./VerifyUserForm.module.sass";
import TextInput from "../../components/TextInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { resendVerifyUser } from "../../redux/auth/auth.thunk";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../helpers/darkModeContext";
import { getForgotPassSchema } from "../../schema/regSchema";

type FormValues = {
  email: string;
};

const VerifyResendForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locale } = useTheme();
  const schema = getForgotPassSchema(locale as "EN" | "UA");
  const isLoading = useAppSelector(selectIsLogining);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const ans = await dispatch(resendVerifyUser(data));
    if (ans?.type === "auth/login/rejected") {
      return;
    } else {
      reset();
      navigate("/");
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
          </div>
        </div>
      </div>

      <div className={styles.btns}>
        <button type="submit" className={cn("button", styles.button)}>
          {isLoading ? <Loader className="" /> : t("passchange.send-btn")}
        </button>
      </div>
    </form>
  );
};

export default VerifyResendForm;
