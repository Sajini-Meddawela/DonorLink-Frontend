import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import CareHomeLogin from "./pages/CareHomeLogin";
import DonorLogin from "./pages/DonorLogin";
import CareHomeSignup from "./pages/CareSignup";
import DonorSignup from "./pages/DonorSignup";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordVerify from "./pages/PasswordVerify";
import CareDashboard from "./pages/CareDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import InventoryManagement from "./pages/InventoryManagement";
import AddInventory from "./pages/AddInventory";
import DeleteInventory from "./pages/DeleteInventory";
import EditInventory from "./pages/EditInventory";
import ConfirmationEmailSent from "./pages/ConfirmationEmailSent";
import EmailVerifiedPage from "./pages/EmailVerification";
import OTPVerification from "./pages/OTPVerification";
import PasswordRecovered from "./pages/PasswordRecovery";
import EmailConfirmation from "./pages/EmailConfirmation";
import RegistrationSuccessCareHome from "./pages/RegistrationSuccessCarehome";
import AddNeedPage from "./pages/AddNeedPage";
import EditNeedPage from "./pages/EditNeedPage";
import NeedListPage from "./pages/NeedListPage";
import DeleteNeedPage from "./pages/DeleteNeedPage";
import CareHomeMealSchedule from "./pages/CareHomeMealSchedule";
import DonorMealDonation from "./pages/DonorMealDonation";
import CareHomeSelectionPage from "./pages/CareHomeSelectionPage";
import DonorNeedsPage from "./pages/DonorNeedsPage";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carelogin" element={<CareHomeLogin />} />
          <Route path="/donorlogin" element={<DonorLogin />} />
          <Route path="/caresignup" element={<CareHomeSignup />} />
          <Route path="/donorsignup" element={<DonorSignup />} />
          <Route path="/forgotpw" element={<ForgotPassword />} />
          <Route path="/passwordverify" element={<PasswordVerify />} />
          <Route
            path="/confirmation-sent/:email"
            element={<ConfirmationEmailSent />}
          />
          <Route
            path="/auth/:email/verify/:token"
            element={<EmailVerifiedPage />}
          />
          <Route path="otp-sent/:email" element={<OTPVerification />} />
          <Route path="/password-recoverd" element={<PasswordRecovered />} />
          <Route
            path="/email-verification/:email"
            element={<EmailConfirmation />}
          />
          <Route
            path="/registered-carehome/:email"
            element={<RegistrationSuccessCareHome />}
          />
          <Route path="/care_dashboard" element={<CareDashboard />} />
          <Route path="/donor_dashboard" element={<DonorDashboard />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/inventory/delete" element={<DeleteInventory />} />
          <Route path="/inventory/edit/:id" element={<EditInventory />} />
          <Route path="/inventory/add/:careHomeId" element={<AddInventory />} />
          <Route path="/needs" element={<NeedListPage />} />
          <Route path="/needs/add/:careHomeId" element={<AddNeedPage />} />
          <Route path="/needs/edit/:id" element={<EditNeedPage />} />
          <Route path="/needs/delete/:id" element={<DeleteNeedPage />} />
          <Route
            path="/carehome-needs/:careHomeId"
            element={<DonorNeedsPage />}
          />
          <Route path="/scheduling" element={<CareHomeMealSchedule />} />
          <Route path="/meal-scheduling" element={<DonorMealDonation />} />
          <Route path="/select-carehome" element={<CareHomeSelectionPage />} />
          <Route
            path="/carehome-needs/:careHomeId"
            element={<DonorNeedsPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
