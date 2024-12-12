import cn from "classnames";
import styles from "./PassChange.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../redux/auth/auth.thunk";
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
    title: "Set new password",
  },
];

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confpass: string;
};

const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required(),
  newPassword: yup
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
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
                          hookformprop={register("oldPassword")}
                          label="please enter old password"
                          name="oldPassword"
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
                        {errors?.oldPassword && (
                          <p className={styles.errorpass}>
                            {errors.oldPassword.message}
                          </p>
                        )}
                      </div>
                      <div className={styles.field}>
                        <TextInput
                          hookformprop={register("newPassword")}
                          label="new password"
                          name="newPassword"
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
                        {errors?.newPassword && (
                          <p className={styles.errorpass}>
                            {errors.newPassword.message}
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
                    {isLoading ? <Loader className="" /> : "Change password"}
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

export default ChangePasswordPage;
