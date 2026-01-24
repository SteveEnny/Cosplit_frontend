import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

/* Loading */
const SplashLogo = lazy(() => import("./components/Loading"));

/* Public Pages */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Preonboarding = lazy(() => import("./pages/Onboarding"));
const Postonboarding = lazy(() => import("./pages/OnBoardingSteps"));
// const Identify = lazy(() => import("./pages/Identification"));
const ForgetPassword = lazy(() => import("./pages/Auth/ForgetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ConfirmPassword = lazy(() => import("./pages/Auth/ConfirmPassword/ConfirmPassword")
);
const PasswordResetSuccess = lazy(() => import("./pages/PasswordResetSuccess"));
const OnboardingSteps = lazy(() => import("./pages/OnBoardingSteps"));

/* Dashboard */
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));
const Overview = lazy(() => import("./pages/Dashboard/DashHome"));
const Messages = lazy(() => import("./pages/Dashboard/Messages"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics"));
const MySplitz = lazy(() => import("./pages/Dashboard/MySplitz"));
const Payment = lazy(() => import("./pages/Dashboard/Payment"));
const Successful = lazy(() => import("./pages/Dashboard/SplitzSuccessful"));
const Wallet = lazy(() => import("./pages/Dashboard/Wallet"));
const CreateSplitzPage = lazy(() => import("./pages/Dashboard/CreateSplitz"));
const NotificationPage = lazy(() => import("./pages/Dashboard/Notification"));
const Filter = lazy(() => import("./pages/Dashboard/Filter"));
const AllTasksPage = lazy(() => import("./pages/Dashboard/AllTasksPage"));
const SplitDetailPage = lazy(() => import("./pages/Dashboard/splitdetailpage"));

/* Settings */
const SettingsLayout = lazy(() =>
  import("./pages/Dashboard/Settings/SettingsLayout")
);
const MyProfile = lazy(() => import("./pages/Dashboard/Settings/MyProfile"));
const NotificationSettings = lazy(() =>
  import("./pages/Dashboard/Settings/Notifications")
);
const Verification = lazy(() =>
  import("./pages/Dashboard/Settings/Verification")
);
const Support = lazy(() => import("./pages/Dashboard/Settings/Support"));
const ResetPassword = lazy(() =>
  import("./pages/Dashboard/Settings/ResetPassword")
);

/* KYC */
const KYCConfirmation = lazy(() =>
  import("./pages/Identification/KYCConfirmation")
);

export default function App() {
  return (
    <Suspense fallback={<SplashLogo />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding */}
        <Route path="/pre-onboard" element={<Preonboarding />} />
        {/* <Route path="/identify" element={<Identify />} /> */}
        <Route path="/post-onboarding" element={<Postonboarding/>} />

        {/* Password */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="mysplitz" element={<MySplitz />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="create-splitz" element={<CreateSplitzPage />} />
          <Route path="kyc-flow" element={<KYCConfirmation />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="payment" element={<Payment />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="filter" element={<Filter />} />
          <Route path="splitz-success" element={<Successful />} />
          <Route path="all-tasks" element={<AllTasksPage />} />
          <Route path="splitz/:id" element={<SplitDetailPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="verification" element={<Verification />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
