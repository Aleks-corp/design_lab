import cn from "classnames";
import styles from "./SignIn.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Sign In",
  },
];

const SignIn = () => {
  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Login</h1>
            <div className={styles.info}>
              If you haven't any registeration account on this site, please
              visit <strong>Sign Up</strong> page first.
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
                      label="email"
                      name="Email"
                      type="email"
                      placeholder="example@email.com"
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="password"
                      name="password"
                      type="text"
                      placeholder="Qwerty123"
                      required
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
                <button className={cn("button", styles.button)}>Login</button>
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

export default SignIn;
