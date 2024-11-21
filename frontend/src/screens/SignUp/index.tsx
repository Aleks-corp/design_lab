import cn from "classnames";
import styles from "./SignUp.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../redux/auth/auth.thunk";
import { useState } from "react";
import { selectUserError } from "../../redux/selectors";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Sign Up",
  },
];

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectUserError);

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!name) {
      console.log("!name");
      return;
    }
    if (!email) {
      console.log("!email");
      return;
    }
    if (!pass) {
      console.log("!pass");
      return;
    }
    if (!confPass) {
      console.log("!confpass");
      return;
    }
    if (pass !== confPass) {
      console.log("pass!==pass");
      return;
    }
    if (!name && !email && !pass && !confPass) {
      return;
    }
    const data = { name, email, password: pass };
    await dispatch(signUp(data));
    if (error) {
      console.log(error);
    } else {
      navigate("/verify");
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
              You can set preferred display name and create{" "}
              <strong>your personal profile</strong>.
            </div>
          </div>
          <div className={styles.row}>
            {/* <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img src="/images/content/avatar-1.jpg" alt="Avatar" />
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.text}>
                    We recommend an image of at least 400x400. Gifs work too{" "}
                    <span role="img" aria-label="hooray">
                      🙌
                    </span>
                  </div>
                  <div className={styles.file}>
                    <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                    >
                      Upload
                    </button>
                    <input className={styles.load} type="file" />
                  </div>
                </div>
              </div>
            </div> */}
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Account info</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="display name"
                      name="Name"
                      type="text"
                      placeholder="Enter your display Nick"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="your email"
                      name="Email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="your password"
                      name="password"
                      type="text"
                      placeholder="Qwerty123"
                      required
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="Confirm password"
                      name="password"
                      type="text"
                      placeholder="Qwerty123"
                      required
                      value={confPass}
                      onChange={(e) => setConfPass(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div className={styles.item}>
                  <div className={styles.category}>Social</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="portfolio or website"
                      name="Portfolio"
                      type="text"
                      placeholder="Enter URL"
                      required
                    />
                    <div className={styles.box}>
                      <TextInput
                        className={styles.field}
                        label="twitter"
                        name="Twitter"
                        type="text"
                        placeholder="@twitter username"
                        required
                      />
                      <button
                        className={cn(
                          "button-stroke button-small",
                          styles.button
                        )}
                      >
                        Verify account
                      </button>
                    </div>
                  </div>
                  <button
                    className={cn("button-stroke button-small", styles.button)}
                  >
                    <Icon title="plus-circle" size={16} />
                    <span>Add more social account</span>
                  </button>
                </div> */}
              </div>
              {/* <div className={styles.note}>
                To update your settings you should sign message through your
                wallet. Click 'Update profile' then sign the message
              </div> */}
              <div className={styles.btns}>
                <button
                  className={cn("button", styles.button)}
                  onClick={(e) => onSubmit(e)}
                >
                  Sign Up
                </button>
                <button className={styles.clear}>
                  <Icon title="circle-close" size={24} />
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
