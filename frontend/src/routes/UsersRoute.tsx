import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/selectors";
import Loader from "../components/LoaderCircle";
import styles from "../styles/App.module.sass";

/**
 * - If the route is private and the User is logged in, render the component
 * - Otherwise render <Navigate> to redirectTo
 */

interface RouteProps {
  component: JSX.Element;
  redirectTo: string;
}

export const UsersRoute = ({
  component: Component,
  redirectTo = "/",
}: RouteProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  if (isRefreshing) {
    return <Loader className={styles.mainloader} />;
  }

  return isLoggedIn ? Component : <Navigate to={redirectTo} />;
};
