import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extraemos el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Token no válido. Por favor, utiliza el enlace de restablecimiento de contraseña enviado a tu correo.');
      setIsSuccess(false);
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword });
      setMessage('Contraseña actualizada con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.');
      setIsSuccess(true);
    } catch {
      setMessage('Error al restablecer la contraseña. El token puede ser inválido o ha expirado.');
      setIsSuccess(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">Nueva Contraseña:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar Contraseña</button>
      </form>
      {message && <p>{message}</p>}
      {isSuccess && (
        <button className="go-to-login-button" onClick={handleGoToLogin}>
          Ir al Login
        </button>
      )}
    </div>
  );
}
