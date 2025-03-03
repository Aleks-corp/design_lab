import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { refreshUser } from "./redux/auth/auth.thunk";
import "./styles/app.sass";
import styles from "./styles/App.module.sass";
import Page from "./components/Page";
import Loader from "./components/LoaderCircle";
import { AdminRoute } from "./routes/AdminRoute";
import { MemberRoute, UsersRoute } from "./routes/UsersRoute";
import { RestrictedRoute } from "./routes/RestrictedRoute";
import { selectUserError } from "./redux/selectors";

const ErrorPage = lazy(() => import("./screens/Error"));
const NotFoundPage = lazy(() => import("./screens/NotFound"));
const Home = lazy(() => import("./screens/Home"));
const Faq = lazy(() => import("./screens/Faq"));
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
  const [date, setDate] = useState(new Date());
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectUserError);
  useEffect(() => {
    if (error && error === "Network Error") {
      navigate("/error");
      return;
    }
  }, [error, navigate]);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
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
            path="post/:id"
            element={
              <Page>
                <Post />
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
            path="register"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <SignUp />
                  </Page>
                }
              />
            }
          />
          <Route
            path="login"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <SignIn />
                  </Page>
                }
              />
            }
          />
          <Route
            path="verify/:token"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <VerifyPage />
                  </Page>
                }
              />
            }
          />
          <Route
            path="resendverify"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <VerifyPageResend />
                  </Page>
                }
              />
            }
          />
          <Route
            path="forgot-password"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <ForgotPassPage />
                  </Page>
                }
              />
            }
          />
          <Route
            path="reset-password/:newPassToken"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={
                  <Page>
                    <ResetPasswordPage />
                  </Page>
                }
              />
            }
          />
          <Route
            path="payment"
            element={
              <MemberRoute
                redirectTo="/"
                component={
                  <Page>
                    <PaymentPage date={date} />
                  </Page>
                }
              />
            }
          />
          <Route
            path="payment-success"
            element={
              <UsersRoute
                redirectTo="/"
                component={
                  <Page>
                    <PaymentSuccessPage />
                  </Page>
                }
              />
            }
          />
          <Route
            path="profile"
            element={
              <UsersRoute
                redirectTo="/"
                component={
                  <Page>
                    <Profile setDate={setDate} />
                  </Page>
                }
              />
            }
          />
          <Route
            path="profile-edit"
            element={
              <UsersRoute
                redirectTo="/"
                component={
                  <Page>
                    <ProfileEdit />
                  </Page>
                }
              />
            }
          />
          <Route
            path="change-password"
            element={
              <UsersRoute
                redirectTo="/"
                component={
                  <Page>
                    <ChangePasswordPage />
                  </Page>
                }
              />
            }
          />
          <Route
            path="upload-post"
            element={
              <AdminRoute
                redirectTo="/"
                component={
                  <Page>
                    <UploadPost />
                  </Page>
                }
              />
            }
          />
          <Route
            path="unpublished-post"
            element={
              <AdminRoute
                redirectTo="/"
                component={
                  <Page>
                    <UnpublishedPosts />
                  </Page>
                }
              />
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute
                redirectTo="/"
                component={
                  <Page>
                    <Users />
                  </Page>
                }
              />
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <NotFoundPage />
              </Page>
            }
          />
          <Route
            path="error"
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
