import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import YearDetails from './pages/YearDetails';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';
import OnboardingRoute from './components/OnboardingRoute';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Analytics />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />{' '}
          {/* "Replace" prevents going back to blank page */}
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ONBOARDING ROUTE - To protect onboarding page*/}
          <Route element={<OnboardingRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
          {/* PRIVATE ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route
                path=""
                element={<Navigate to="/dashboard/year/1" replace />}
              />{' '}
              {/* For now redirect to first year dashboard, whilst overview page is WIP */}
              {/* If nothing is added after "/dashboard" URI, then redirected to "overview"*/}
              <Route path="overview" element={<Overview />} />
              <Route
                path="year"
                element={<Navigate to="/dashboard/overview" replace />}
              />
              <Route path="year/:id" element={<YearDetails />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
