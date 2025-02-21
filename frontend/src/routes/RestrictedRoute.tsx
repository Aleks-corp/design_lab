import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/selectors";
import Loader from "../components/LoaderCircle";
import styles from "../styles/App.module.sass";

/**
 * - If the route is restricted and the user is logged in, render a <Navigate> to redirectTo
 * - Otherwise render the component
 */

interface RouteProps {
  component: JSX.Element;
  redirectTo: string;
}

export const RestrictedRoute = ({
  component: Component,
  redirectTo = "/",
}: RouteProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  if (isRefreshing) {
    return <Loader className={styles.mainloader} />;
  }

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
