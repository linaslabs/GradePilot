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
import { AuthProvider } from './contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />{' '}
          {/* "Replace" prevents going back to blank page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              path=""
              element={<Navigate to="/dashboard/overview" replace />}
            />{' '}
            {/* If nothing is added after "/dashboard" URI, then redirected to "overview"*/}
            <Route path="overview" element={<Overview />} />
            <Route
              path="year"
              element={<Navigate to="/dashboard/overview" replace />}
            />
            <Route path="year/:id" element={<YearDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
