import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import GaleriaAdmin from '../Components/GaleríaAdmin';
import '../styles/admin-dashboard.css';
import { SearchType, Solicitud } from '../types';
import Modal from './Modal';
import OverviewGrid from './Overview-Grid';
import UserMenu from './UserMenu';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('nombre');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'details' | 'update'>('add');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [voluntariadoResponse, donantesResponse, adultosMayoresResponse, asociadosResponse] = await Promise.all([
          fetch('http://localhost:8080/api/voluntariado'),
          fetch('http://localhost:8080/api/donante'),
          fetch('http://localhost:8080/api/adultomayor'),
          fetch('http://localhost:8080/api/asociado'),
        ]);

        if (!voluntariadoResponse.ok) throw new Error('Error al cargar los datos de voluntariado');
        if (!donantesResponse.ok) throw new Error('Error al cargar los datos de donantes');
        if (!adultosMayoresResponse.ok) throw new Error('Error al cargar los datos de adultos mayores');
        if (!asociadosResponse.ok) throw new Error('Error al cargar los datos de asociados');

        const voluntariadoData = await voluntariadoResponse.json();
        const donantesData = await donantesResponse.json();
        const adultosMayoresData = await adultosMayoresResponse.json();
        const asociadosData = await asociadosResponse.json();

        const solicitudesVoluntariado = voluntariadoData.map((voluntariado: any) => ({
          id: voluntariado.id,
          nombre: voluntariado.nombre || 'Sin nombre',
          apellido1: voluntariado.apellido1 || 'Sin apellidos',
          apellido2: voluntariado.apellido2 || 'Sin apellidos',
          cedula: voluntariado.cedula,
          email: voluntariado.email,
          fechaNacimiento: voluntariado.fechaNacimiento || 'Fecha no disponible',
          telefono: voluntariado.telefono,
          direccion: voluntariado.direccion,
          comentarios: voluntariado.comentarios,
          tipoSolicitud: 'Voluntariado',
          estadouser: voluntariado.estadoUsuario ? 'Activo' : 'Inactivo',
          estado: voluntariado.estadoAprobado === null ? 'Pendiente' : voluntariado.estadoAprobado ? 'Aprobada' : 'Rechazada',
        }));

        const solicitudesDonantes = donantesData.map((donante: any) => ({
          id: donante.id,
          nombre: donante.nombre,
          apellido1: donante.apellido1,
          apellido2: donante.apellido2,
          cedula: donante.cedula,
          email: donante.email,
          fechaDonacion: donante.fechaDonacion,
          telefono: donante.telefono,
          tipoDonacion: donante.tipoDonacion,
          medioDonar: donante.medioDonar,
          montoDonacion: donante.montoDonacion,
          descripDonacion: donante.descripDonacion,
          tipoSolicitud: 'Donación',
          estadouser: donante.estadoUsuario? 'Activo' : 'Inactivo',
          estado: donante.estadoAprobado === null ? 'Pendiente' : donante.estadoAprobado ? 'Aprobada' : 'Rechazada',
        }));

        const solicitudesAdultosMayores = adultosMayoresData.map((adulto: any) => ({
          id: adulto.id,
          cedula: adulto.cedula,
          nombre: adulto.nombre || 'Sin nombre',
          apellido1: adulto.apellido1 || 'Sin apellidos',
          apellido2: adulto.apellido2 || 'Sin apellidos',
          email: adulto.email || 'Sin email',
          telefono: adulto.telefono || 'Sin teléfono',
          fechaNacimiento: adulto.fechaNacimiento,
          fechaIngreso: adulto.fechaRegistro || 'Fecha no disponible',
          genero: adulto.genero,
          patologías: adulto.patologías,
          medicamento: adulto.medicamento,
          dosis: adulto.dosis,
          cedulaEncargado: adulto.cedulaEncargado,
          nombreEncargado: adulto.nombreEncargado,
          apellido1Encargado: adulto.apellido1Encargado,
          apellido2Encargado: adulto.apellido2Encargado,
          emailEncargado: adulto.emailEncargado,
          telefonoEncargado: adulto.telefonoEncargado,
          fechaNacimientoEncargado: adulto.fechaNacimientoEncargado,
          fechaRegistro: adulto.fechaRegistro,
          generoEncargado: adulto.generoEncargado,
          tipoSolicitud: 'RegistrarAdultoMayor',
          estadouser: adulto.estadoUsuario? 'Activo' : 'Inactivo',
          estado: adulto.estadoAprobado === null ? 'Pendiente' : adulto.estadoAprobado ? 'Aprobada' : 'Rechazada',
        }));

        const solicitudesAsociados = asociadosData.map((asociado: any) => ({
          id: asociado.id,
          nombre: asociado.nombre || 'Sin nombre',
          apellido1: asociado.apellido1 || 'Sin apellidos',
          apellido2: asociado.apellido2 || 'Sin apellidos',
          cedula: asociado.cedula,
          email: asociado.email || 'Sin email',
          direccion: asociado.direccion,
          ocupacion: asociado.ocupacion,
          fecha: asociado.fecha,
          telefono: asociado.telefono || 'Sin teléfono',
          observaciones: asociado.observaciones,
          tipoSolicitud: 'Asociación',
          estadouser: asociado.estadoUsuario? 'Activo' : 'Inactivo',
          estado: asociado.estadoAprobado === null ? 'Pendiente' : asociado.estadoAprobado ? 'Aprobada' : 'Rechazada',
        }));

        setSolicitudes([
          ...solicitudesVoluntariado,
          ...solicitudesDonantes,
          ...solicitudesAdultosMayores,
          ...solicitudesAsociados,
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        toast.error('Error al cargar los datos. Inténtalo nuevamente.');
        setLoading(false);
      }
    };

    fetchDatos();
    const interval = setInterval(fetchDatos, 1000); 

    return () => clearInterval(interval);
  }, []);

  const solicitudesPorTipo = {
    Voluntariado: solicitudes.filter(s => s.tipoSolicitud === 'Voluntariado') || [],
    Donación: solicitudes.filter(s => s.tipoSolicitud === 'Donación') || [],
    Asociación: solicitudes.filter(s => s.tipoSolicitud === 'Asociación') || [],
    RegistrarAdultoMayor: solicitudes.filter(s => s.tipoSolicitud === 'RegistrarAdultoMayor') || [],
  };

  const filteredSolicitudes = useMemo(() => {
    return solicitudes
      .filter((solicitud) => {
        if (searchType === 'cedula') {
          return solicitud.cedula?.includes(searchQuery);
        } else if (searchType === 'nombre') {
          return (
            solicitud.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            solicitud.apellido1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            solicitud.apellido2?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return true;
      })
      .filter((solicitud) => {
        if (activeTab === 'voluntariado') return solicitud.tipoSolicitud === 'Voluntariado';
        if (activeTab === 'donaciones') return solicitud.tipoSolicitud === 'Donación';
        if (activeTab === 'asociados') return solicitud.tipoSolicitud === 'Asociación';
        if (activeTab === 'adultos-mayores') return solicitud.tipoSolicitud === 'RegistrarAdultoMayor';
        return true;
      });
  }, [solicitudes, searchType, searchQuery, activeTab]);

  const paginatedSolicitudes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSolicitudes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSolicitudes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderTablaCabeceras = (tipo: string) => {
    switch (tipo) {
      case 'voluntariado':
        return (
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer apellido </th>
            <th>Segundo apellido </th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Fecha nacimiento</th>
            <th>Teléfono</th>
            <th>Comentarios</th>
            <th>tipo solicitud</th>
            <th>Estado usuario</th>
            <th>Estado solicitud</th>
            <th>Acciones</th>
          </tr>
        );
      case 'donaciones':
        return (
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer apellido</th>
            <th>Segundo apellido </th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Fecha donación</th>
            <th>Teléfono</th>
            <th>Tipo donación</th>
            <th>Medio donar</th>
            <th>Monto donación</th>
            <th>Descripción</th>
            <th>tipo solicitud</th>
            <th>Estado usuario</th>
            <th>Estado solicitud</th>
            <th>Acciones</th>
          </tr>
        );
      case 'adultos-mayores':
        return (
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer apellido</th>
            <th>Segundo apellido </th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Fecha nacimiento</th>
            <th>Fecha registro</th>
            <th>Genero</th>
            <th>Patologías</th>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Nombre encargado</th>
            <th>Primer apellido encargado</th>
            <th>Segundo apellido encargado</th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Fecha nacimiento</th>
            <th>Genero encargado</th>
            <th>tipo solicitud</th>
            <th>Estado usuario</th>
            <th>Estado solicitud</th>
            <th>Acciones</th>
          </tr>
        );
      case 'asociados':
        return (
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer apellido</th>
            <th>Segundo apellido </th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ocupación</th>
            <th>Observaciones</th>
            <th>tipo solicitud</th>
            <th>Estado usuario</th>
            <th>Estado solicitud</th>
            <th>Acciones</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderFila = (solicitud: Solicitud) => {
    if (solicitud.tipoSolicitud === 'Voluntariado') {
      return (
        <tr key={solicitud.tipoSolicitud + solicitud.id}>
          <td>{solicitud.id}</td>
          <td>{solicitud.nombre}</td>
          <td>{solicitud.apellido1}</td>
          <td>{solicitud.apellido2}</td>
          <td>{solicitud.cedula}</td>
          <td>{solicitud.email}</td>
          <td>{solicitud.fechaNacimiento}</td>
          <td>{solicitud.telefono}</td>
          <td>{solicitud.comentarios}</td>
          <td>{solicitud.tipoSolicitud}</td>
          <td>{solicitud.estadouser}</td>
          <td>{solicitud.estado}</td>
          <td>
            <div className='button-container'>
              <button className="btn-detalles" onClick={() => openModal('details', solicitud)}>Detalles</button>
              <button className="btn-aprobar" onClick={() => handleAprobarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Aprobar</button>
              <button className="btn-rechazar" onClick={() => handleRechazarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Rechazar</button>
              <button className="btn-activo" onClick={() => handleActivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Activo/a</button>
              <button className="btn-inactivo" onClick={() => handleInactivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Inactivo/a</button>
            </div>
          </td>
        </tr>
      );
    } else if (solicitud.tipoSolicitud === 'Donación') {
      return (
        <tr key={solicitud.tipoSolicitud + solicitud.id}>
          <td>{solicitud.id}</td>
          <td>{solicitud.nombre}</td>
          <td>{solicitud.apellido1}</td>
          <td>{solicitud.apellido2}</td>
          <td>{solicitud.cedula}</td>
          <td>{solicitud.email}</td>
          <td>{solicitud.fechaDonacion}</td>
          <td>{solicitud.telefono}</td>
          <td>{solicitud.tipoDonacion}</td>
          <td>{solicitud.medioDonar}</td>
          <td>{solicitud.montoDonacion}</td>
          <td>{solicitud.descripDonacion}</td>
          <td>{solicitud.tipoSolicitud}</td>
          <td>{solicitud.estadouser}</td>
          <td>{solicitud.estado}</td>
          <td>
            <div className='button-container'>
              <button className="btn-detalles" onClick={() => openModal('details', solicitud)}>Detalles</button>
              <button className="btn-aprobar" onClick={() => handleAprobarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Aprobar</button>
              <button className="btn-rechazar" onClick={() => handleRechazarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Rechazar</button>
              <button className="btn-activo" onClick={() => handleActivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Activo/a</button>
              <button className="btn-inactivo" onClick={() => handleInactivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Inactivo/a</button>
            </div>
          </td>
        </tr>
      );
    } else if (solicitud.tipoSolicitud === 'RegistrarAdultoMayor') {
      return (
        <tr key={solicitud.tipoSolicitud + solicitud.id}>
          <td>{solicitud.id}</td>
          <td>{solicitud.nombre}</td>
          <td>{solicitud.apellido1}</td>
          <td>{solicitud.apellido2}</td>
          <td>{solicitud.cedula}</td>
          <td>{solicitud.email}</td>
          <td>{solicitud.telefono}</td>
          <td>{solicitud.fechaNacimiento}</td>
          <td>{solicitud.fechaRegistro}</td>
          <td>{solicitud.genero}</td>
          <td>{solicitud.patologías}</td>
          <td>{solicitud.medicamento}</td>
          <td>{solicitud.dosis}</td>
          <td>{solicitud.nombreEncargado}</td>
          <td>{solicitud.apellido1Encargado}</td>
          <td>{solicitud.apellido2Encargado}</td>
          <td>{solicitud.cedulaEncargado}</td>
          <td>{solicitud.emailEncargado}</td>
          <td>{solicitud.telefonoEncargado}</td>
          <td>{solicitud.fechaNacimientoEncargado}</td>
          <td>{solicitud.generoEncargado}</td>
          <td>{solicitud.tipoSolicitud}</td>
          <td>{solicitud.estadouser}</td>
          <td>{solicitud.estado}</td>
          <td>
            <div className='button-container'>
              <button className="btn-detalles" onClick={() => openModal('details', solicitud)}>Detalles</button>
              <button className="btn-aprobar" onClick={() => handleAprobarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Aprobar</button>
              <button className="btn-rechazar" onClick={() => handleRechazarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Rechazar</button>
              <button className="btn-activo" onClick={() => handleActivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Activo/a</button>
              <button className="btn-inactivo" onClick={() => handleInactivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Inactivo/a</button>
            </div>
          </td>
        </tr>
      );
    } else if (solicitud.tipoSolicitud === 'Asociación') {
      return (
        <tr key={solicitud.tipoSolicitud + solicitud.id}>
          <td>{solicitud.id}</td>
          <td>{solicitud.nombre}</td>
          <td>{solicitud.apellido1}</td>
          <td>{solicitud.apellido2}</td>
          <td>{solicitud.cedula}</td>
          <td>{solicitud.email}</td>
          <td>{solicitud.telefono}</td>
          <td>{solicitud.ocupacion}</td>
          <td>{solicitud.observaciones}</td>
          <td>{solicitud.tipoSolicitud}</td>
          <td>{solicitud.estadouser}</td>
          <td>{solicitud.estado}</td>
          <td>
            <div className='button-container'>
              <button className="btn-detalles" onClick={() => openModal('details', solicitud)}>Detalles</button>
              <button className="btn-aprobar" onClick={() => handleAprobarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Aprobar</button>
              <button className="btn-rechazar" onClick={() => handleRechazarSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Rechazar</button>
              <button className="btn-activo" onClick={() => handleActivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Activo/a</button>
              <button className="btn-inactivo" onClick={() => handleInactivaSolicitud(solicitud.tipoSolicitud, solicitud.id)}>Inactivo/a</button>
            </div>
          </td>
        </tr>
      );
    }
    return null;
  };

  if (loading) {
    return <div>Cargando solicitudes...</div>;
  }

  const openModal = (type: 'add' | 'details' | 'update', solicitud?: Solicitud) => {
    setModalType(type);
    setSelectedSolicitud(solicitud || null);
    setModalOpen(true);
  };

  const getUrlTipoSolicitud = (tipoSolicitud: string): string => {
    switch (tipoSolicitud) {
      case 'Voluntariado':
        return 'http://localhost:8080/api/voluntariado';
      case 'Donación':
        return 'http://localhost:8080/api/donante';
      case 'RegistrarAdultoMayor':
        return 'http://localhost:8080/api/adultomayor';
      case 'Asociación':
        return 'http://localhost:8080/api/asociado';
      default:
        throw Error('Tipo solicitud inválido');
    }
  }
  

  const handleAprobarSolicitud = async (tipoSolicitud: string, idSolicitud: string) => {
      const solicitudActual = solicitudes.find(
          (solicitud) => solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud
      );
  
      if (solicitudActual?.estado === 'Aprobada') {
          Swal.fire({
              title: 'Solicitud ya aprobada',
              text: 'Esta solicitud ya ha sido aprobada.',
              icon: 'info',
              confirmButtonText: 'Aceptar'
          });
          return;
      }
  
      const confirmResult = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas aprobar esta solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, aprobar',
          cancelButtonText: 'Cancelar'
      });
  
      if (confirmResult.isConfirmed) {
          let urlSolicitudRuta = getUrlTipoSolicitud(tipoSolicitud);
          await fetch(`${urlSolicitudRuta}/${idSolicitud}/estado?nuevoEstado=true`, { method: 'PUT' });
  
          const updatedSolicitudes = solicitudes.map((solicitud) => {
              if (solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud) {
                  return { ...solicitud, estado: 'Aprobada' };
              }
              return solicitud;
          });
          setSolicitudes(updatedSolicitudes);
  
          Swal.fire({
              title: 'Aprobado',
              text: 'La solicitud ha sido aprobada exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
          });
      }
  };
  
  const handleRechazarSolicitud = async (tipoSolicitud: string, idSolicitud: string) => {
      const solicitudActual = solicitudes.find(
          (solicitud) => solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud
      );
  
      if (solicitudActual?.estado === 'Rechazada') {
          Swal.fire({
              title: 'Solicitud ya rechazada',
              text: 'Esta solicitud ya ha sido rechazada.',
              icon: 'info',
              confirmButtonText: 'Aceptar'
          });
          return;
      }
  
      const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción rechazará la solicitud.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, rechazar',
          cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
          let urlSolicitudRuta = getUrlTipoSolicitud(tipoSolicitud);
          await fetch(`${urlSolicitudRuta}/${idSolicitud}/estado?nuevoEstado=false`, { method: 'PUT' });
  
          const updatedSolicitudes = solicitudes.map((solicitud) => {
              if (solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud) {
                  return { ...solicitud, estado: 'Rechazada' };
              }
              return solicitud;
          });
          setSolicitudes(updatedSolicitudes);
  
          Swal.fire('Rechazada', 'La solicitud ha sido rechazada.', 'success');
      }
  };
  
  const handleActivaSolicitud = async (tipoSolicitud: string, idSolicitud: string) => {
      const solicitudActual = solicitudes.find((solicitud) => solicitud.id === idSolicitud);
  
      if (solicitudActual?.estadouser === 'Activo') {
          Swal.fire({
              title: 'Solicitud ya activa',
              text: 'Esta solicitud ya está en estado activo.',
              icon: 'info',
              confirmButtonText: 'Aceptar'
          });
          return;
      }
  
      const confirmResult = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas activar esta solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, activar',
          cancelButtonText: 'Cancelar'
      });
  
      if (confirmResult.isConfirmed) {
          let urlSolicitudRuta = getUrlTipoSolicitud(tipoSolicitud);
          await fetch(`${urlSolicitudRuta}/${idSolicitud}/activo?nuevoActivo=true`, { method: 'PUT' });
  
          const updatedSolicitudes = solicitudes.map((solicitud) => {
              if (solicitud.id === idSolicitud) {
                  return { ...solicitud, estadouser: 'Activo' };
              }
              return solicitud;
          });
          setSolicitudes(updatedSolicitudes);
  
          Swal.fire({
              title: 'Activado',
              text: 'La solicitud ha sido activada exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
          });
      }
  };
  
  const handleInactivaSolicitud = async (tipoSolicitud: string, idSolicitud: string) => {
      const solicitudActual = solicitudes.find(
          (solicitud) => solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud
      );
  
      if (solicitudActual?.estadouser === 'Inactivo') {
          Swal.fire({
              title: 'Solicitud ya inactiva',
              text: 'Esta solicitud ya está en estado inactivo.',
              icon: 'info',
              confirmButtonText: 'Aceptar'
          });
          return;
      }
  
      const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción marcará al usuario como inactivo.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, inactivar',
          cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
          let urlSolicitudRuta = getUrlTipoSolicitud(tipoSolicitud);
          await fetch(`${urlSolicitudRuta}/${idSolicitud}/activo?nuevoActivo=false`, { method: 'PUT' });
  
          const updatedSolicitudes = solicitudes.map((solicitud) => {
              if (solicitud.tipoSolicitud === tipoSolicitud && solicitud.id === idSolicitud) {
                  return { ...solicitud, estadouser: 'Inactivo' };
              }
              return solicitud;
          });
          setSolicitudes(updatedSolicitudes);
  
          Swal.fire('Inactivo', 'El usuario ha sido marcado como inactivo.', 'success');
      }
  };
  


  

  const handleAddSolicitud = (newSolicitud: Omit<Solicitud, 'id'>) => {
    const newId = (parseInt(solicitudes[solicitudes.length - 1].id) + 1).toString().padStart(3, '0');
    setSolicitudes(prevSolicitudes => [{...newSolicitud, id: newId}, ...prevSolicitudes]);
    setModalOpen(false);
  };

  const handleUpdateStatus = (updatedSolicitud: Solicitud) => {
    setSolicitudes(prevSolicitudes => 
      prevSolicitudes.map(sol => 
        sol.id === updatedSolicitud.id ? updatedSolicitud : sol
      )
    );
    setModalOpen(false);
    setSelectedSolicitud(null);
  };

  const handleSubmitModal = (updatedSolicitud: Solicitud) => {
    setSolicitudes(prevSolicitudes => 
      prevSolicitudes.map(solicitud => 
        solicitud.id === updatedSolicitud.id ? updatedSolicitud : solicitud
      )
    );
  };

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav>
          {[
            { icon: '📊', label: 'Dashboard', value: 'overview' },
            { icon: '📋', label: 'Todas', value: 'todas' },
            { icon: '❤️', label: 'Voluntariado', value: 'voluntariado' },
            { icon: '💰', label: 'Donaciones', value: 'donaciones' },
            { icon: '🤝', label: 'Asociados', value: 'asociados' },
            { icon: '👵', label: 'Adultos Mayores', value: 'adultos-mayores' },
            { icon: '🖼️', label: 'Galería', value: 'galeria' },
          ].map(({ icon, label, value }) => (
            <button key={value} className={activeTab === value ? 'active' : ''} onClick={() => setActiveTab(value)}>
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <UserMenu />

        {activeTab === 'overview' ? (
          <OverviewGrid solicitudesPorTipo={solicitudesPorTipo} />
        ) : activeTab === 'galeria' ? (
          <GaleriaAdmin />
        ) : (
          <>
            <header className="search-header">
              <input
                type="text"
                placeholder={`Buscar por ${searchType}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select onChange={(e) => setSearchType(e.target.value as SearchType)}>
                <option value="nombre">Nombre</option>
                <option value="cedula">Cédula</option>
              </select>
            </header>

            <section className="solicitudes-list">
              <table>
                <thead>{renderTablaCabeceras(activeTab)}</thead>
                <tbody>{paginatedSolicitudes.map(renderFila)}</tbody>
              </table>
            </section>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>{`Página ${currentPage} de ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="items-per-page">
                <option value="6">6 por página</option>
                <option value="12">12 por página</option>
                <option value="24">24 por página</option>
                <option value="48">48 por página</option>
                <option value="96">96 por página</option>
              </select>
            </div>
          </>
        )}

        {modalOpen && (
          <Modal
            type={modalType}
            solicitud={selectedSolicitud}
            onAdd={handleAddSolicitud}
            onUpdate={handleUpdateStatus}
            onSubm

it={handleSubmitModal}
            onClose={() => setModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
}