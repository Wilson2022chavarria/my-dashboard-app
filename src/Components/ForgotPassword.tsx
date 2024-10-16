import axios from 'axios';
import React, { useState } from 'react';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setMessage('Correo de restablecimiento enviado, revisa tu bandeja de entrada.');
      setIsError(false);
    } catch {
      setMessage('Error al enviar el correo de restablecimiento. Por favor, intenta nuevamente.');
      setIsError(true);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar correo de recuperación</button>
      </form>
      {message && <p className={isError ? 'error' : ''}>{message}</p>}
      <a href="/" className="back-button">Regresar</a>
    </div>
  );
}
