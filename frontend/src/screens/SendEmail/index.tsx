import cn from "classnames";
import styles from "./SendEmail.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { emailRegexp } from "../../constants/user.constants";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { resendVerifyUser } from "../../redux/auth/auth.thunk";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Send Email",
  },
];

type FormValues = {
  email: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegexp, "Oops! That email doesn't seem right")
    .required(),
});

const SendEmail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Send Email</h1>
            <div className={styles.info}>Please enter your email first.</div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.list}>
                  <div className={styles.item}>
                    <div className={styles.category}>Account info</div>

                    <div className={styles.fieldset}>
                      <div className={styles.field}>
                        <TextInput
                          hookformprop={register("email")}
                          label="email"
                          name="Email"
                          type="email"
                          placeholder="example@email.com"
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
                    {isLoading ? <Loader className="" /> : "Send Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
