import cn from "classnames";
import styles from "./SignIn.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { emailRegexp } from "../../constants/user.constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { forgotPassword } from "../../redux/auth/auth.thunk";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Sign In",
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

const ForgotPassPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLogining);

  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

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
    if (ans?.type === "auth/login/rejected") {
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
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          {notFound && (
            <div className={styles.top}>
              <h1 className={cn("h2", styles.title)}>Vorgot Password</h1>
              <div className={styles.info}>
                <p>Check email to set new password</p>
              </div>
            </div>
          )}
          {isSuccess && !notFound ? (
            <div className={styles.top}>
              <h1 className={cn("h2", styles.title)}>Vorgot Password</h1>
              <div className={styles.info}>
                Sorry, you haven't any registeration account on this site,
                please{" "}
                <Link className={styles.link} to="/register">
                  Sign Up
                </Link>{" "}
                first.
              </div>
            </div>
          ) : (
            <>
              <div className={styles.top}>
                <h1 className={cn("h2", styles.title)}>Vorgot Password</h1>
                <div className={styles.info}>
                  <p>Enter your Email to set new password</p>
                </div>
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
                              <p className={styles.error}>
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.btns}>
                      <button
                        type="submit"
                        className={cn("button", styles.button)}
                      >
                        {isLoading ? <Loader className="" /> : "Send"}
                      </button>
                      <button type="reset" className={styles.clear}>
                        <Icon title="circle-close" size={24} />
                        Clear all
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;
