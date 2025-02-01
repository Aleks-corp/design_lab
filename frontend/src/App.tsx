import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { selectIsRefreshing, selectToken } from "./redux/selectors";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { refreshUser } from "./redux/auth/auth.thunk";
import "./styles/app.sass";
import styles from "./styles/App.module.sass";
import Page from "./components/Page";
import Loader from "./components/LoaderCircle";

const ErrorPage = lazy(() => import("./screens/Error"));
const Faq = lazy(() => import("./screens/Faq"));
const Home = lazy(() => import("./screens/Home"));
const ChangePasswordPage = lazy(() => import("./screens/PassChange"));
const ForgotPassPage = lazy(() => import("./screens/PassForgot"));
const ResetPasswordPage = lazy(() => import("./screens/PassReset"));
const PaymentPage = lazy(() => import("./screens/Payment"));
const PaymentSuccessPage = lazy(() => import("./screens/PaymentSuccess"));
const Post = lazy(() => import("./screens/Post"));
const Profile = lazy(() => import("./screens/Profile"));
const ProfileEdit = lazy(() => import("./screens/ProfileEdit"));
const SignIn = lazy(() => import("./screens/SignIn"));
const SignUp = lazy(() => import("./screens/SignUp"));
const UnpublishedPosts = lazy(() => import("./screens/UnpublishedPosts"));
const UploadPost = lazy(() => import("./screens/UploadPost"));
const Users = lazy(() => import("./screens/Users"));
const VerifyPage = lazy(() => import("./screens/VerifyUser"));
const VerifyPageResend = lazy(() => import("./screens/VerifyUserResend"));

function App() {
  const dispatch = useAppDispatch();
  const isRefreshing = useAppSelector(selectIsRefreshing);
  const token = useAppSelector(selectToken);
  useEffect(() => {
    if (token) {
      dispatch(refreshUser());
    }
  }, [dispatch, token]);

  return isRefreshing ? (
    <Loader className={styles.mainloader} />
  ) : (
    <Suspense fallback={<Loader className={styles.mainloader} />}>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="register"
            element={
              <Page>
                <SignUp />
              </Page>
            }
          />
          <Route
            path="login"
            element={
              <Page>
                <SignIn />
              </Page>
            }
          />
          <Route
            path="verify/:token"
            element={
              <Page>
                <VerifyPage />
              </Page>
            }
          />
          <Route
            path="resendverify"
            element={
              <Page>
                <VerifyPageResend />
              </Page>
            }
          />
          <Route
            path="forgot-password"
            element={
              <Page>
                <ForgotPassPage />
              </Page>
            }
          />
          <Route
            path="reset-password/:newPassToken"
            element={
              <Page>
                <ResetPasswordPage />
              </Page>
            }
          />
          <Route
            path="change-password"
            element={
              <Page>
                <ChangePasswordPage />
              </Page>
            }
          />
          <Route
            path="payment"
            element={
              <Page>
                <PaymentPage />
              </Page>
            }
          />
          <Route
            path="payment-success"
            element={
              <Page>
                <PaymentSuccessPage />
              </Page>
            }
          />

          <Route
            path="upload-post"
            element={
              <Page>
                <UploadPost />
              </Page>
            }
          />
          <Route
            path="unpublished-post"
            element={
              <Page>
                <UnpublishedPosts />
              </Page>
            }
          />
          <Route
            path="faq"
            element={
              <Page>
                <Faq />
              </Page>
            }
          />

          <Route
            path="profile"
            element={
              <Page>
                <Profile />
              </Page>
            }
          />
          <Route
            path="profile-edit"
            element={
              <Page>
                <ProfileEdit />
              </Page>
            }
          />
          <Route
            path="post/:id"
            element={
              <Page>
                <Post />
              </Page>
            }
          />
          <Route
            path="admin/users"
            element={
              <Page>
                <Users />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <ErrorPage />
              </Page>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
