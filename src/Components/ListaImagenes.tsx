import React, { useState, useEffect } from 'react';

const ListaImagenes: React.FC = () => {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/images/list')
      .then(response => response.json())
      .then(data => setImagenes(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Imágenes Subidas</h2>
      <ul>
        {imagenes.map((imagen: any) => (
          <li key={imagen.id}>
            <img src={`http://localhost:8080/${imagen.filePath}`} alt={imagen.name} width="100" />
            <p>{imagen.name}</p>
            <button>Eliminar</button>
            <button>Editar Descripción</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaImagenes;
