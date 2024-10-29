/*import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      // Mostrar SweetAlert de éxito con opción de ir a Gmail
      Swal.fire({
        title: 'Correo enviado',
        text: 'Correo de restablecimiento enviado, revisa tu bandeja de entrada.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Abrir Gmail',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige a Gmail en una nueva pestaña
          window.open('https://mail.google.com', '_blank');
        }
      });
      setMessage('Correo de restablecimiento enviado, revisa tu bandeja de entrada.');
      setIsError(false);
    } catch {
      setMessage('Error al enviar el correo de restablecimiento. Por favor, intenta nuevamente.');
      setIsError(true);
     } finally {
        setIsLoading(false); // Desactivar el estado de carga
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar correo de recuperación'}
        </button>
       {/* <button type="submit">Enviar correo de recuperación</button> /}
      </form>
      {message && <p className={isError ? 'error' : ''}>{message}</p>}
      <a href="/" className="back-button">Regresar</a>
    </div>
  );
} */



  import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/ForgotPassword.css';
  
  export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true); // Activar el estado de carga
      try {
        await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
        
        // Mostrar SweetAlert de éxito con opción de ir a Gmail
        Swal.fire({
          title: 'Correo enviado',
          text: 'Correo de restablecimiento enviado, revisa tu bandeja de entrada.',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Abrir Gmail',
          cancelButtonText: 'Cerrar',
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#6c757d'
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirige a Gmail en una nueva pestaña
            window.open('https://mail.google.com', '_blank');
          }
        });
  
        setMessage('Correo de restablecimiento enviado, revisa tu bandeja de entrada.');
        setIsError(false);
      } catch {
        setMessage('Error al enviar el correo de restablecimiento. Por favor, intenta nuevamente.');
        setIsError(true);
      } finally {
        setIsLoading(false); // Desactivar el estado de carga
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
        </form>
        {message && <p className={isError ? 'error' : ''}>{message}</p>}
        <a href="/" className="back-button">Regresar</a>
      </div>
    );
  }
  