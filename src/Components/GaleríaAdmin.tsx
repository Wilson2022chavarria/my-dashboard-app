/*import { useState, useEffect } from 'react';
import axios from 'axios';

interface Image {
  id: number;
  fileName: string;
  name: string;
  filePath: string;
}

export default function GaleriaAdmin() {
  const [images, setImages] = useState<Image[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  // Cargar imágenes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/images/list');
        setImages(response.data);
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  // Manejar subida de imagen
  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);
    formData.append('name', description);

    try {
      await axios.post('http://localhost:8080/api/images/upload', formData);
      setDescription('');
      setNewImage(null);
      // Recargar imágenes después de la subida
      const response = await axios.get('http://localhost:8080/api/images/list');
      setImages(response.data);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  return (
    <div>
      <h2>Galería - Admin</h2>

      <div>
        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
        />
        <input
          type="text"
          placeholder="Descripción de la imagen"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleImageUpload}>Subir Imagen</button>
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={`http://localhost:8080/${image.filePath}`} alt={image.name} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
} */
/*
  import React, { useState } from 'react';
  import axios from 'axios';
  import '../styles/GaleriaAdmin.css'; // Importa el archivo CSS
  
  const GaleriaAdmin = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!selectedFile) {
        setUploadStatus('Por favor selecciona una imagen para subir.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', description);
  
      try {
        const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadStatus('Imagen subida exitosamente.');
        setUploadedImages((prev) => [...prev, response.data.fileName]);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        setUploadStatus('Error al subir la imagen.');
      }
    };
  
    return (
      <div className="galeria-admin-container">
        <h2>Galería - Admin</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="file-input">Seleccionar imagen:</label>
            <input type="file" id="file-input" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description-input">Descripción:</label>
            <input
              type="text"
              id="description-input"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Descripción de la imagen"
            />
          </div>
          <button type="submit" className="upload-button">Subir Imagen</button>
        </form>
  
        {uploadStatus && <p className="status-message">{uploadStatus}</p>}
  
        <h3>Imágenes Subidas</h3>
        <ul className="image-list">
          {uploadedImages.map((image, index) => (
            <li key={index} className="image-item">
              {image}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default GaleriaAdmin; */
  import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/GaleriaAdmin.css';
  
  const GaleriaAdmin = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<{ id: number; fileName: string, name: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
  
    // Fetch imágenes cargadas previamente cuando se monta el componente
    useEffect(() => {
      const fetchUploadedImages = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/images/list');
          // Se asume que el servidor devuelve una lista de objetos con 'url' y 'description'
          setUploadedImages(response.data);
        } catch (error) {
          console.error('Error al obtener las imágenes:', error);
        }
      };
  
      fetchUploadedImages();
    }, []);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(e.target.value);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!selectedFile) {
        setUploadStatus('Por favor selecciona una imagen para subir.');
        return;
      }
  
      // Verificar que el archivo es una imagen
      const fileType = selectedFile.type;
      if (!fileType.startsWith('image/')) {
        setUploadStatus('Solo se permiten archivos de imagen.');
        return;
      }
  
      setIsUploading(true);
      setUploadStatus(null);
  
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('description', description);
  
      try {
        const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Basic ' + btoa('admin:password'),
          },
        });
  
        // Actualizar estado con la nueva imagen subida
        setUploadedImages((prev) => [
          ...prev, 
          {
            id: response.data.id,
            fileName: response.data.fileName,
            name: response.data.name }
        ]);
  
        setUploadStatus('Imagen subida exitosamente.');
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        setUploadStatus('Error al subir la imagen.');
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
        setDescription('');
      }
    };
  
    const handleDeleteImage = async (imageId: number) => {
      try {
        await axios.delete(`http://localhost:8080/api/images/delete/${imageId}`, {
          headers: {
            Authorization: 'Basic ' + btoa('admin:password'),
          },
        });
  
        // Filtrar la imagen eliminada del estado
        setUploadedImages(prev => prev.filter(image => image.id !== imageId));
        setUploadStatus('Imagen eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        setUploadStatus('Error al eliminar la imagen.');
      }
    };
  
    return (
      <div className="galeria-admin-container">
        <h2>Galería - Admin</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="file-input">Seleccionar imagen:</label>
            <input type="file" id="file-input" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description-input">Descripción:</label>
            <input
              type="text"
              id="description-input"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Descripción de la imagen"
            />
          </div>
          <button type="submit" className="upload-button" disabled={isUploading}>
            {isUploading ? 'Subiendo...' : 'Subir Imagen'}
          </button>
        </form>
  
        {uploadStatus && <p className="status-message">{uploadStatus}</p>}
  
        <h3>Imágenes Subidas</h3>
        <ul className="image-list">
          {uploadedImages.map((image, index) => (
            <li key={index} className="image-item">
              <img src={`http://localhost:8080/uploads/${image.fileName}`} alt={`Imagen ${index + 1}`} className="uploaded-image" />
              <p>{image.name}</p>
              <button onClick={() => handleDeleteImage(image.id)} className="delete-button">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default GaleriaAdmin;