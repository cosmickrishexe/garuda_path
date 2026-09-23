import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DispatchProvider } from './context/DispatchContext';
import { Dashboard } from './pages/Dashboard';
import { DriverPortal } from './pages/DriverPortal';
import { TrackingPage } from './pages/TrackingPage';
import { Login } from './pages/Login';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DispatchProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/driver" element={<DriverPortal />} />
            <Route path="/tracking/:trackingCode" element={<TrackingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DispatchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
