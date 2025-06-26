import cn from "classnames";
import styles from "./PassForgotForm.module.sass";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { forgotPassword } from "../../redux/auth/auth.thunk";
import { useTheme } from "../../helpers/darkModeContext";
import { getForgotPassSchema } from "../../schema/regSchema";
import { SetStateAction } from "react";
import { useTranslation } from "react-i18next";

type FormValues = {
  email: string;
};
interface IForgotPass {
  setIsSuccess: React.Dispatch<SetStateAction<boolean>>;
  setNotFound: React.Dispatch<SetStateAction<boolean>>;
}
const ForgotPassForm = ({ setIsSuccess, setNotFound }: IForgotPass) => {
  const dispatch = useAppDispatch();
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
    const ans = await dispatch(forgotPassword(data));
    if (ans?.type === "auth/forgotpassword/rejected") {
      if (ans.payload.status === 404) {
        setNotFound(true);
      }
      return;
    } else {
      setNotFound(false);
      setIsSuccess(true);
      reset();
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
                label={t("passchange.forgot-label")}
                name="Email"
                type="email"
                placeholder={t("passchange.forgot-placeholder")}
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
        <button type="reset" className={styles.clear}>
          <Icon title="circle-close" size={24} />
          {t("passchange.reset-btn")}
        </button>
      </div>
    </form>
  );
};

export default ForgotPassForm;
