

import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Register.css';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData); // <-- Añade esto para ver los datos
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
       /* Mostrar SweetAlert de éxito
       Swal.fire({
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
       }); */
       // Mostrar SweetAlert de éxito con opción de ir al login
      Swal.fire({
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión.',
        icon: 'success',
        confirmButtonText: 'Ir al login',
        confirmButtonColor: '#007bff'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige al login si el usuario confirma
          window.location.href = '/login';
        }
      });
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error('Error al registrar el administrador:', err);
      setError('Error al registrar el administrador. Inténtalo nuevamente.');
    }
  };

  
  return (
    <div className="register-container">
      <h2>Registro de Administrador</h2>
      {success && <p className="success">Registro exitoso. Ahora puedes iniciar sesión.</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Nombre de Usuario" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      <a href="/" className="back-button">Regresar</a>
    </div>
  );
}

