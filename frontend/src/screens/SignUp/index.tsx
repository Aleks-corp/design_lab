import "react-phone-number-input/style.css";
import cn from "classnames";
import styles from "./SignUp.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../redux/auth/auth.thunk";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { selectIsLogining } from "../../redux/selectors";
import Loader from "../../components/Loader";
import { regSchema } from "../../schema/regSchema";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import PhoneInput from "../../components/PhoneInput";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Sign Up",
  },
];

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confpass: string;
};

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLogining);

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(regSchema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, email, phone, password } = data;
    const cleanedPhone = phone.replace("+", "");
    try {
      await dispatch(
        signUp({
          name,
          email: email.toLowerCase(),
          phone: cleanedPhone,
          password,
        })
      ).unwrap();
      setTimeout(() => {
        navigate("/verify/0");
        reset();
      }, 0);
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Registration</h1>
            <div className={styles.info}>
              <p>
                You can set preferred display name and create your personal
                profile.
              </p>
              <p>
                Already have an account?{" "}
                <Link className={styles.link} to="/login">
                  Sign In here
                </Link>
                .
              </p>
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
                          hookformprop={register("name")}
                          label="nickname"
                          name="Name"
                          type="text"
                          placeholder="Enter your nickname"
                          required
                        />
                        {errors?.name && (
                          <p className={styles.error}>{errors.name.message}</p>
                        )}
                      </div>
                      <div className={styles.field}>
                        <TextInput
                          hookformprop={register("email")}
                          label="your email"
                          name="Email"
                          type="email"
                          placeholder="example@email.com"
                          required
                        />
                        {errors?.email && (
                          <p className={styles.error}>{errors.email.message}</p>
                        )}
                      </div>
                      <div className={styles.field}>
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
                          label="your password"
                          name="password"
                          type={showPass ? "text" : "password"}
                          placeholder="example: Qwerty123"
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
                          placeholder="example: Qwerty123"
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
                    {isLoading ? <Loader className="" /> : "Sign Up"}
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

export default SignUp;
