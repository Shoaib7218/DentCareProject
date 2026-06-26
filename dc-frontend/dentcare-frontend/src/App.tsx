import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import  Login from "./pages/Login";
import  Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageServices from "./pages/admin/ManageServices";
import ManageAppointments from "./pages/admin/ManageAppointments";

import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import AdminReports from "./pages/admin/AdminReports";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import ManageHolidays from "./pages/admin/ManageHolidays";

import VerifyOtp from "./pages/VerifyOtp";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="ADMIN"><ManageDoctors /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute allowedRole="ADMIN"><ManageServices /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute allowedRole="ADMIN"><ManageAppointments /></ProtectedRoute>} />
          <Route path="/admin/holidays" element={<ProtectedRoute allowedRole="ADMIN"><ManageHolidays /></ProtectedRoute>} />

          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRole="PATIENT"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/book" element={<ProtectedRoute allowedRole="PATIENT"><BookAppointment /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute allowedRole="PATIENT"><MyAppointments /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRole="ADMIN"><AdminReports /></ProtectedRoute>} />

          <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute allowedRole="DOCTOR"><DoctorSchedule /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute allowedRole="PATIENT"><PatientProfile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;