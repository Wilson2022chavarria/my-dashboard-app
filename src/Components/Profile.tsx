import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';  // Archivo CSS para estilos

interface UserProfile {
  id: number;
  email: string;
  username: string;
  fotoPerfil: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch('http://localhost:8080/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUser(data);
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/api/admin/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const imageUrl = await response.text();
      setUser(prevUser => prevUser ? { ...prevUser, fotoPerfil: imageUrl } : null);
    } catch (error) {
      console.error('Error al subir la imagen', error);
    }
  };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Perfil del Administrador</h1>
      <div className="profile-card">
        <div className="profile-image-section">
          <img 
            src={user.fotoPerfil || "https://via.placeholder.com/150"} 
            alt="Foto de perfil" 
            className="profile-image" 
          />
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="profileImage" className="form-label">Cambiar foto de perfil:</label>
            <input type="file" id="profileImage" accept="image/*" onChange={handleFileChange} className="file-input" />
          </div>
          <button type="submit" className="submit-button">Subir Imagen</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
