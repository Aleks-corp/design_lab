import cn from "classnames";
import styles from "./PassReset.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { setNewPassword } from "../../redux/auth/auth.thunk";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { passRegexp } from "../../constants/user.constants";
import { useState } from "react";
import { selectIsLogining, selectUserError } from "../../redux/selectors";
import Loader from "../../components/Loader";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Reset password",
  },
];

type FormValues = {
  password: string;
  confpass: string;
};

const schema = yup.object().shape({
  password: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required(),
  confpass: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Set new password</h1>
            <div className={styles.info}>
              You can set up new password for{" "}
              <strong>your personal profile</strong>.
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
                          hookformprop={register("password")}
                          label="your password"
                          name="password"
                          type={showPass ? "text" : "password"}
                          placeholder="Example: Qwerty123"
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
                          <p className={styles.errorpass}>
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className={styles.field}>
                        <TextInput
                          hookformprop={register("confpass")}
                          label="Confirm password"
                          name="password"
                          type={showConfPass ? "text" : "password"}
                          placeholder="Example: Qwerty123"
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
                          <p className={styles.errorpass}>
                            {errors.confpass.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.btns}>
                  <button type="submit" className={cn("button", styles.button)}>
                    {isLoading ? <Loader className="" /> : "Set new password"}
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

export default ResetPasswordPage;
