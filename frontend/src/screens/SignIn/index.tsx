import cn from "classnames";
import styles from "./SignIn.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { emailRegexp, passRegexp } from "../../constants/user.constants";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { logIn } from "../../redux/auth/auth.thunk";

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
  password: string;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegexp, "Oops! That email doesn't seem right")
    .required(),
  password: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required(),
});

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLogining);

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
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Login</h1>
            <div className={styles.info}>
              If you haven't any registeration account on this site, please{" "}
              <Link className={styles.link} to="/register">
                Sign Up
              </Link>{" "}
              first.
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
                          <p className={styles.error}>{errors.email.message}</p>
                        )}
                      </div>
                      <div className={styles.field}>
                        <TextInput
                          hookformprop={register("password")}
                          label="password"
                          name="password"
                          type={showPass ? "text" : "password"}
                          placeholder="example: Qwerty123"
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
                          <p className={styles.errorpass}>
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      {isntVerify ? (
                        <Link to="/resendverify" className={styles.link}>
                          Resend Email
                        </Link>
                      ) : (
                        <Link to="/forgot-password" className={styles.link}>
                          Forgot Password
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
                    Clear all
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

export default SignIn;
