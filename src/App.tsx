import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CareHomeLogin from './pages/CareHomeLogin';
import DonorLogin from './pages/DonorLogin';
import CareHomeSignup from './pages/CareSignup';
import DonorSignup from './pages/DonorSignup';
import ForgotPassword from './pages/ForgotPassword';
import PasswordVerify from './pages/PasswordVerify';
import CareDashboard from './pages/CareDashboard';
import InventoryManagement from './pages/InvantoryManagement';
import AddInventory from './pages/AddInventory';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path = "/login" element={<Login />} />
          <Route path = "/carelogin" element={<CareHomeLogin />} />
          <Route path = "/donorlogin" element={<DonorLogin />} />
          <Route path = "/caresignup" element={<CareHomeSignup />} />
          <Route path = "/donorsignup" element={<DonorSignup />} />
          <Route path = "/forgotpw" element = {<ForgotPassword/>}/>
          <Route path = "/passwordverify" element = {<PasswordVerify/>}/>
          <Route path = "/care_dashboard" element = {<CareDashboard/>}/>
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/inventory/add" element={<AddInventory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
