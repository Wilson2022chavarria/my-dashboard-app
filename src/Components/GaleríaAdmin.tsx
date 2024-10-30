import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/GaleriaAdmin.css';

interface Image {
  id: number;
  fileName: string;
  name: string;
  description: string;
}

const GaleriaAdmin = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/images/list');
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

      setUploadedImages((prev) => [
        ...prev,
        {
          id: response.data.id,
          fileName: response.data.fileName,
          name: response.data.name,
          description: response.data.description,
        },
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

      setUploadedImages(prev => prev.filter(image => image.id !== imageId));
      setUploadStatus('Imagen eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      setUploadStatus('Error al eliminar la imagen.');
    }
  };

  const handleEditDescription = (image: Image) => {
    setEditingId(image.id);
    setEditDescription(image.description);
  };

  const handleSaveDescription = async (imageId: number) => {
    try {
      await axios.put(`http://localhost:8080/api/images/update/${imageId}`, 
        null, // Cuerpo vacío para que el request body se interprete correctamente
        {
          params: {
            description: editDescription, // Parámetro de la descripción en la URL
          },
          headers: {
            Authorization: 'Basic ' + btoa('admin:password'),
          },
        }
      );

      setUploadedImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, description: editDescription } : img
      ));
      setEditingId(null);
      setUploadStatus('Descripción actualizada exitosamente.');
    } catch (error) {
      console.error('Error al actualizar la descripción:', error);
      setUploadStatus('Error al actualizar la descripción.');
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
        {uploadedImages.map((image) => (
          <li key={image.id} className="image-item">
            <img src={`http://localhost:8080/uploads/${image.fileName}`} alt={image.name} className="uploaded-image" />
            <div className="image-details">
              <p className="image-name">{image.name}</p>
              {editingId === image.id ? (
                <div className="edit-description">
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-description-input"
                  />
                  <div className="edit-buttons">
                    <button onClick={() => handleSaveDescription(image.id)} className="save-button">Guardar</button>
                    <button onClick={() => setEditingId(null)} className="cancel-button">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="image-description">{image.description}</p>
                  <button onClick={() => handleEditDescription(image)} className="edit-button">Editar</button>
                </>
              )}
            </div>
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
