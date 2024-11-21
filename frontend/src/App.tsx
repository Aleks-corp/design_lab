import { Routes, Route } from "react-router-dom";
import "./styles/app.sass";
import Page from "./components/Page";
import Main from "./screens/Main";
import UploadVariants from "./screens/UploadVariants";
import UploadDetails from "./screens/UploadDetails";
import ConnectWallet from "./screens/ConnectWallet";
import Faq from "./screens/Faq/index";
import Activity from "./screens/Activity";
import Home from "./screens/Home";
import Search02 from "./screens/Search02";
import Profile from "./screens/Profile";
import ProfileEdit from "./screens/ProfileEdit";
import Item from "./screens/Item";
import PageList from "./screens/PageList";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import VerifyPage from "./screens/VerifyUser";

function App() {
  return (
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
          path="upload-variants"
          element={
            <Page>
              <UploadVariants />
            </Page>
          }
        />
        <Route
          path="upload-details"
          element={
            <Page>
              <UploadDetails />
            </Page>
          }
        />
        <Route
          path="connect-wallet"
          element={
            <Page>
              <ConnectWallet />
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
          path="activity"
          element={
            <Page>
              <Activity />
            </Page>
          }
        />
        <Route
          path="search01"
          element={
            <Page>
              <Main />
            </Page>
          }
        />
        <Route
          path="search02"
          element={
            <Page>
              <Search02 />
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
              <Item />
            </Page>
          }
        />
        <Route
          path="pagelist"
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
