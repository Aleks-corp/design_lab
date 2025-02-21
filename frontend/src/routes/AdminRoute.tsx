import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAdmin, selectIsRefreshing } from "../redux/selectors";
import Loader from "../components/LoaderCircle";
import styles from "../styles/App.module.sass";

/**
 * - If the route is private and the Admin is logged in, render the component
 * - Otherwise render <Navigate> to redirectTo
 */

interface RouteProps {
  component: JSX.Element;
  redirectTo: string;
}

export const AdminRoute = ({
  component: Component,
  redirectTo = "/",
}: RouteProps) => {
  const isAdmin = useSelector(selectIsAdmin);
  const isRefreshing = useSelector(selectIsRefreshing);
  if (isRefreshing) {
    return <Loader className={styles.mainloader} />;
  }

  return isAdmin ? Component : <Navigate to={redirectTo} />;
};
