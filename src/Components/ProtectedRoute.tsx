/*
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;  */



import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element | JSX.Element[] }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
