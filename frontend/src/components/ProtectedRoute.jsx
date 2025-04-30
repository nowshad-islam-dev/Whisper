import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { accessToken } = useSelector((state) => state.auth);

  if (!accessToken) {
    // If there is no access token, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If there is an access token, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
