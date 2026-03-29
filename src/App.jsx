import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import Overview from './pages/Overview';
import Clients from './pages/Clients';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Simulator from './pages/Simulator';
import './App.css';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isHomepage = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      <CustomCursor />
      <div className="animated-bg" />
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Homepage />} />
        <Route
          path="/overview"
          element={
            <DashboardLayout>
              <Overview />
            </DashboardLayout>
          }
        />
        <Route
          path="/clients"
          element={
            <DashboardLayout>
              <Clients />
            </DashboardLayout>
          }
        />
        <Route
          path="/alerts"
          element={
            <DashboardLayout>
              <Alerts />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          }
        />
        <Route
          path="/simulator"
          element={
            <DashboardLayout>
              <Simulator />
            </DashboardLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
