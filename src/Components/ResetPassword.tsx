/*import axios from 'axios';
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
*/




import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extraemos el token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      Swal.fire({
        title: 'Error',
        text: 'Token no válido. Por favor, utiliza el enlace de restablecimiento de contraseña enviado a tu correo.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword });

      // Mostrar SweetAlert de éxito y redirigir al login
      Swal.fire({
        title: 'Contraseña actualizada',
        text: 'Contraseña actualizada con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.',
        icon: 'success',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#007bff'
      }).then(() => {
        navigate('/login'); // Redirige al usuario al login después de cerrar SweetAlert
      });
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Error al restablecer la contraseña. El token puede ser inválido o ha expirado.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    }
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
    </div>
  );
}
