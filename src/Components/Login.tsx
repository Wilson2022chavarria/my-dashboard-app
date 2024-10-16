// src/components/Login.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem('token', response.data); // Guardar el token JWT
      setError(null);
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión para Administradores</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Correo" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Contraseña" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Iniciar Sesión</button>
      </form>

      <div className="login-links">
        <Link to="/register">Registrar un nuevo Admin</Link>
        <Link to="/forgot-password">Recuperar Contraseña</Link>
      </div>
    </div>
  );
};

export default Login;
