import { Routes, Route } from "react-router-dom";
import "./styles/app.sass";
import styles from "./styles/App.module.sass";
import Page from "./components/Page";
import Main from "./screens/Main";
// import UploadVariants from "./screens/UploadVariants";
import UploadPost from "./screens/UploadPost";
// import ConnectWallet from "./screens/ConnectWallet";
import Faq from "./screens/Faq/index";
// import Activity from "./screens/Activity";
import Home from "./screens/Home";
// import Search02 from "./screens/Search02";
import Profile from "./screens/Profile";
import ProfileEdit from "./screens/ProfileEdit";
import Post from "./screens/Post";
import PageList from "./screens/PageList";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import VerifyPage from "./screens/VerifyUser";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { refreshUser } from "./redux/auth/auth.thunk";
import { useEffect } from "react";
import { selectIsRefreshing } from "./redux/selectors";
import Loader from "./components/LoaderCircle";
import ForgotPassPage from "./screens/PassForgot";
import VerifyPageResend from "./screens/VerifyUserResend";
import ResetPasswordPage from "./screens/PassReset";
import ChangePasswordPage from "./screens/PassChange";

function App() {
  const dispatch = useAppDispatch();
  const isRefreshing = useAppSelector(selectIsRefreshing);
  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <Loader className={styles.mainloader} />
  ) : (
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
        {/* <Route
          path="upload-variants"
          element={
            <Page>
              <UploadVariants />
            </Page>
          }
        /> */}
        <Route
          path="upload-post"
          element={
            <Page>
              <UploadPost />
            </Page>
          }
        />
        {/* <Route
          path="connect-wallet"
          element={
            <Page>
              <ConnectWallet />
            </Page>
          }
        /> */}
        <Route
          path="faq"
          element={
            <Page>
              <Faq />
            </Page>
          }
        />
        {/* <Route
          path="activity"
          element={
            <Page>
              <Activity />
            </Page>
          }
        /> */}
        <Route
          path="main"
          element={
            <Page>
              <Main />
            </Page>
          }
        />
        {/* <Route
          path="search02"
          element={
            <Page>
              <Search02 />
            </Page>
          }
        /> */}
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
        {/* <Route
          path="pagelist"
          element={
            <Page>
              <PageList />
            </Page>
          }
        /> */}
        <Route
          path="*"
          element={
            <Page>
              <PageList />
            </Page>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
