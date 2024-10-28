import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
//import Dashboard from './components/Dashboard';
import ForgotPassword from './Components/ForgotPassword';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Register from './Components/Register';
import ResetPassword from './Components/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';
//import DonanteDashboard from './components/DonanteDashboard';
import AdminDashboard from './Components/Admin-Dashboard';
import Profile from './Components/Profile';



function App() {
  return (
    <Router>
      <Routes>
         {/* Redirigir la ruta raíz al login */}
         <Route path="/" element={<Navigate to="/login" />} />
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path ="/reset-password" element={<ResetPassword/>} />
        {/*<Route path="/donantes" element={<DonanteDashboard />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
             <Profile /> 
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
