import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import Landing from './pages/Landing'
import AboutUsPage from './pages/AboutUsPage'
import CareGuide from './pages/CareGuide'
import Contact from './pages/Contact'
import AdoptionProcess from './pages/AdoptionProcess'
import RehomingProcess from './pages/RehomingProcess'
import AdoptionFAQS from './pages/AdoptionFAQS'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Auth
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Dashboards
import AdminDashboard from './components/Dashboard/AdminDashboard'
import AdopterDashboard from './components/Dashboard/AdopterDashboard'
import RehomerDashboard from './components/Dashboard/RehomerDashboard'

// ─── Helper ────────────────────────────────────────────────────────────────
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

// ─── PrivateRoute: blocks unauthenticated users, enforces role if needed ───
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Right person, wrong page — redirect to their own dashboard
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'rehomer') return <Navigate to="/rehomer/dashboard" replace />;
    return <Navigate to="/adopter/dashboard" replace />;
  }

  return children;
};

// ─── PublicRoute: already-logged-in users skip login/register ──────────────
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getUser();

  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'rehomer') return <Navigate to="/rehomer/dashboard" replace />;
    return <Navigate to="/adopter/dashboard" replace />;
  }

  return children;
};

// ─── DashboardRouter: /dashboard → correct dashboard ──────────────────────
const DashboardRouter = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'rehomer') return <Navigate to="/rehomer/dashboard" replace />;
  return <Navigate to="/adopter/dashboard" replace />;
};

// ─── Layout wrapper ────────────────────────────────────────────────────────
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>

        {/* Auth routes — no Navbar/Footer, blocked if already logged in */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected dashboard routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/adopter/dashboard"
          element={
            <PrivateRoute allowedRoles={['adopter']}>
              <AdopterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/rehomer/dashboard"
          element={
            <PrivateRoute allowedRoles={['rehomer']}>
              <RehomerDashboard />
            </PrivateRoute>
          }
        />

        {/* Generic /dashboard → redirects based on role */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />

        {/* Public routes with Navbar + Footer */}
        <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutUsPage /></MainLayout>} />
        <Route path="/care-guide" element={<MainLayout><CareGuide /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/adoption-process" element={<MainLayout><AdoptionProcess /></MainLayout>} />
        <Route path="/rehoming-process" element={<MainLayout><RehomingProcess /></MainLayout>} />
        <Route path="/adoption-faq" element={<MainLayout><AdoptionFAQS /></MainLayout>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;