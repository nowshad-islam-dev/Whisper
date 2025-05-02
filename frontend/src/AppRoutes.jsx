import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import ChatApp from './components/ChatApp';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes using layout/nesting */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatApp />} />
        </Route>

        {/* Redirect to Login by Default */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
