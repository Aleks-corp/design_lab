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

const VerifyPage = () => {
  const dispatch = useAppDispatch();
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
      {token === "0" && !error && (
        <h3 className={styles.title}>Check Your Email to verify account</h3>
      )}

      {isLoggining && !error && <Loader className={styles.loader} />}
      {!isLoggining && isLoggedIn && (
        <>
          <h3 className={styles.title}>
            Verification success
            <NavLink className={styles.titlelink} to="/">
              Go to Main
            </NavLink>
          </h3>
        </>
      )}
      {error === "Verification has already been passed." &&
        !isLoggining &&
        !isLoggedIn && (
          <>
            <h3 className={styles.title}>
              Verification has already been passed
              <NavLink className={styles.titlelink} to="/login">
                Go to Login
              </NavLink>
            </h3>
          </>
        )}
    </>
  );
};

export default VerifyPage;
