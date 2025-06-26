import { useEffect } from "react";
import styles from "./VerifyUser.module.sass";
import { NavLink, useParams } from "react-router-dom";
import { verifyUser } from "../../redux/auth/auth.thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectIsLoggedIn,
  selectIsLogining,
  selectUserError,
} from "../../redux/selectors";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

const VerifyPage = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isLoggining = useAppSelector(selectIsLogining);
  const error = useAppSelector(selectUserError);

  const { token } = useParams();
  useEffect(() => {
    if (token && token !== "0") {
      dispatch(verifyUser(token));
    }
  }, [dispatch, token]);

  return (
    <>
      {token === "0" && error !== "Verification has already been passed." && (
        <h3 className={styles.title}>{t("verify.title")}</h3>
      )}

      {isLoggining && !error && <Loader className={styles.loader} />}
      {token !== "0" &&
        !isLoggining &&
        error !== "Verification has already been passed." && (
          <>
            <h3 className={styles.title}>
              {t("verify.success")}
              <NavLink className={styles.titlelink} to="/login">
                {t("verify.success-link")}
              </NavLink>
            </h3>
          </>
        )}
      {error === "Verification has already been passed." &&
        !isLoggining &&
        !isLoggedIn && (
          <>
            <h3 className={styles.title}>
              {t("verify.passed")}
              <NavLink className={styles.titlelink} to="/login">
                {t("verify.success-link")}
              </NavLink>
            </h3>
          </>
        )}
    </>
  );
};

export default VerifyPage;
