import React, { useState } from 'react';
import '../styles/admin-dashboard.css'; // Asegúrate de que el estilo esté conectado correctamente7
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const UserMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Aquí se muestra la alerta de confirmación
    Swal.fire({
      title: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, elimina el token de sesión y redirige
        localStorage.removeItem('token'); // Elimina el token de sesión

        // Redirige a la página de inicio de sesión
        navigate('/login');
      }
    });
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSettings = () => {
    // Lógica para configuración (redirigir a la página de configuración)
    console.log("Ir a configuración");
  };

  return (
    <div className="user-menu">
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          Admin ▼
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <hr className="dropdown-separator" />
            <button className="dropdown-item" onClick={handleProfile}>
              Perfil
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;
