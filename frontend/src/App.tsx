import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { PatientPortalFlow } from './pages/PatientPortalFlow';
import { PredictPage } from './pages/Predict';
import { AppointmentsPage } from './pages/Appointments';
import { DoctorDashboardPage } from './pages/DoctorDashboard';
import { AdminDashboardPage } from './pages/AdminDashboard';
import { AdminModelsPage } from './pages/AdminModels';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Patient Routes: 4-Step Intake & Smart AI Slot Suggestions */}
          <Route path="/dashboard" element={<Layout><PatientPortalFlow /></Layout>} />
          <Route path="/appointments" element={<Layout><AppointmentsPage /></Layout>} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<Layout><DoctorDashboardPage /></Layout>} />

          {/* Admin Routes: Restricted Model State & Testing */}
          <Route path="/admin/dashboard" element={<Layout><AdminDashboardPage /></Layout>} />
          <Route path="/admin/models" element={<Layout><AdminModelsPage /></Layout>} />
          <Route path="/predict" element={<Layout><PredictPage /></Layout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
