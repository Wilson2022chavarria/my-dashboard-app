import React, { useState } from 'react';

const FormularioSubida: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
  
    try {
      // Obtén el token de autenticación (puedes obtenerlo desde el localStorage, sesión, o estado de autenticación)
      const token = localStorage.getItem('token'); // Cambia esto según cómo manejes los tokens
  
      const response = await fetch('http://localhost:8080/api/images/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` // Incluye el token aquí
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
  
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Subir Imagen:</label>
        <input type="file" id="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div>
        <label htmlFor="description">Descripción:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Subir Imagen</button>
    </form>
  );
};

export default FormularioSubida;
