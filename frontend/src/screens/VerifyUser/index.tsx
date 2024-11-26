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
  const isError = useAppSelector(selectUserError);

  const { token } = useParams();
  useEffect(() => {
    if (token && token !== "0") {
      dispatch(verifyUser(token));
    }
  }, [dispatch, token]);

  return (
    <>
      {token === "0" && !isError && (
        <h3 className={styles.title}>Check Email to verify user</h3>
      )}

      {isLoggining && !isError && <Loader className={styles.loader} />}
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
      {isError && (
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
