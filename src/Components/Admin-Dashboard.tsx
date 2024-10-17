import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import GaleriaAdmin from '../Components/GaleríaAdmin';
import '../styles/admin-dashboard.css';
import { SearchType, Solicitud } from '../types';
import Modal from './Modal';
import OverviewGrid from './Overview-Grid';
import UserMenu from './UserMenu';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('nombre');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todas'); // Nueva pestaña para todas las solicitudes
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'details' | 'update'>('add');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [voluntariadoResponse, donantesResponse, adultosMayoresResponse, asociadosResponse] = await Promise.all([
          fetch('http://localhost:8080/api/voluntariado'),
          fetch('http://localhost:8080/api/donante'), // Asegúrate de que la URL es correcta
          fetch('http://localhost:8080/api/adultomayor'), // Llamada al API de Adultos Mayores
          fetch('http://localhost:8080/api/asociado') // Llamada al API de Asociados
        ]);

        if (!voluntariadoResponse.ok) throw new Error('Error al cargar los datos de voluntariado');
        if (!donantesResponse.ok) throw new Error('Error al cargar los datos de donantes');
        if (!adultosMayoresResponse.ok) throw new Error('Error al cargar los datos de adultos mayores');
        if (!asociadosResponse.ok) throw new Error('Error al cargar los datos de asociados');

        const voluntariadoData = await voluntariadoResponse.json();
        const donantesData = await donantesResponse.json();
        const adultosMayoresData = await adultosMayoresResponse.json();
        const asociadosData = await asociadosResponse.json();

        // Transformar datos de voluntariado
        const solicitudesVoluntariado = voluntariadoData.map((voluntariado: any) => ({
          id: voluntariado.id,
          nombre: voluntariado.nombre || 'Sin nombre',
          apellidos: voluntariado.apellidos || 'Sin apellidos',
          cedula: voluntariado.cedula,
          email: voluntariado.email,
          telefono: voluntariado.telefono,
          fechaIngreso: voluntariado.fechaNacimiento || 'Fecha no disponible',
          tipoSolicitud: 'Voluntariado',
          estado: voluntariado.estadoAprobado ? 'Aprobada' : 'Pendiente',
        }));

        // Transformar datos de donantes
        const solicitudesDonantes = donantesData.map((donante: any) => ({
          id: donante.id,
          nombre: donante.nombre,
          apellidos: '', // No se requiere apellidos para donantes
          cedula: donante.cedula,
          email: donante.email,
          telefono: donante.telefono,
          fechaIngreso: donante.fechaDonacion, // Asegúrate de que coincide con el campo correcto
          tipoSolicitud: 'Donación',
          estado: donante.estadoAprobado ? 'Aprobada' : 'Pendiente',
        }));

        // Transformar datos de adultos mayores
        const solicitudesAdultosMayores = adultosMayoresData.map((adulto: any) => ({
          id: adulto.id,
          nombre: adulto.nombre || 'Sin nombre',
          apellidos: adulto.apellidos || 'Sin apellidos',
          cedula: adulto.cedula,
          email: adulto.email || 'Sin email',
          telefono: adulto.telefono || 'Sin teléfono',
          fechaIngreso: adulto.fechaRegistro || 'Fecha no disponible',
          tipoSolicitud: 'Registrar Adulto Mayor',
          estado: adulto.estadoAprobado ? 'Aprobada' : 'Pendiente',
        }));

        // Transformar datos de asociados
        const solicitudesAsociados = asociadosData.map((asociado: any) => ({
          id: asociado.id,
          nombre: asociado.nombre || 'Sin nombre',
          apellidos: asociado.apellidos || 'Sin apellidos',
          cedula: asociado.cedula,
          email: asociado.email || 'Sin email',
          telefono: asociado.telefono || 'Sin teléfono',
          fechaIngreso: asociado.fechaRegistro || 'Fecha no disponible',
          tipoSolicitud: 'Asociación',
          estado: asociado.estadoAprobado ? 'Aprobada' : 'Pendiente',
        }));

        // Combinamos todas las solicitudes
        setSolicitudes([
          ...solicitudesVoluntariado, 
          ...solicitudesDonantes, 
          ...solicitudesAdultosMayores, 
          ...solicitudesAsociados
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        toast.error('Error al cargar los datos. Inténtalo nuevamente.');
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const filteredSolicitudes = useMemo(() => {
    return solicitudes
      .filter(solicitud => {
        if (searchType === 'cedula') {
          return solicitud.cedula?.includes(searchQuery);
        } else if (searchType === 'nombre') {
          return solicitud.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 solicitud.apellidos?.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchType === 'mes') {
          const [year, month] = searchQuery.split('-');
          return solicitud.fechaIngreso?.startsWith(`${year}-${month}`);
        }
        return true;
      })
      .filter(solicitud => {
        // Mostramos todas las solicitudes en la pestaña "todas"
        if (activeTab === 'voluntariado') return solicitud.tipoSolicitud === 'Voluntariado';
        if (activeTab === 'donaciones') return solicitud.tipoSolicitud === 'Donación';
        if (activeTab === 'asociados') return solicitud.tipoSolicitud === 'Asociación';
        if (activeTab === 'adultos-mayores') return solicitud.tipoSolicitud === 'Registrar Adulto Mayor';
        return true; // Para la pestaña "todas", no filtramos por tipo
      })
      .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());
  }, [solicitudes, searchType, searchQuery, activeTab]);

  const solicitudesPorTipo = useMemo(() => ({
    Voluntariado: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Voluntariado'),
    Donación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Donación'),
    Asociación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Asociación'),
    "Registrar Adulto Mayor": solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Registrar Adulto Mayor'),
  }), [solicitudes]);

  if (loading) {
    return <div>Cargando solicitudes...</div>;
  }

  const openModal = (type: 'add' | 'details' | 'update', solicitud?: Solicitud) => {
    setModalType(type);
    setSelectedSolicitud(solicitud || null);
    setModalOpen(true);
  };

  const handleAddSolicitud = (newSolicitud: Omit<Solicitud, 'id' | 'fechaIngreso'>) => {
    const newId = (parseInt(solicitudes[solicitudes.length - 1].id) + 1).toString().padStart(3, '0');
    const currentDate = new Date().toISOString().split('T')[0];
    setSolicitudes(prevSolicitudes => [{...newSolicitud, id: newId, fechaIngreso: currentDate}, ...prevSolicitudes]);
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

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav>
          {[
            { icon: '📊', label: 'Dashboard', value: 'overview' },
            { icon: '📋', label: 'Todas', value: 'todas' }, // Nueva pestaña "Todas"
            { icon: '❤️', label: 'Voluntariado', value: 'voluntariado' },
            { icon: '💰', label: 'Donaciones', value: 'donaciones' },
            { icon: '🤝', label: 'Asociados', value: 'asociados' },
            { icon: '👵', label: 'Adultos Mayores', value: 'adultos-mayores' },
            { icon: '🖼️', label: 'Galería', value: 'galeria' }, // Mantienes la galería
          ].map(({ icon, label, value }) => (
            <button key={value} className={activeTab === value ? 'active' : ''} onClick={() => setActiveTab(value)}>
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
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
                <option value="mes">Mes</option>
              </select>
              <button onClick={() => openModal('add')}>Agregar solicitud</button>
            </header>

            <section className="solicitudes-list">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Cédula</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha Ingreso</th>
                    <th>Tipo de Solicitud</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSolicitudes.map(solicitud => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.id}</td>
                      <td>{solicitud.nombre}</td>
                      <td>{solicitud.apellidos}</td>
                      <td>{solicitud.cedula}</td>
                      <td>{solicitud.email}</td>
                      <td>{solicitud.telefono}</td>
                      <td>{solicitud.fechaIngreso}</td>
                      <td>{solicitud.tipoSolicitud}</td>
                      <td>{solicitud.estado}</td>
                      <td>
                        <button onClick={() => openModal('details', solicitud)}>Detalles</button>
                        <button onClick={() => openModal('update', solicitud)}>Actualizar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {modalOpen && (
          <Modal
            type={modalType}
            solicitud={selectedSolicitud}
            onAdd={handleAddSolicitud}
            onUpdate={handleUpdateStatus}
            onClose={() => setModalOpen(false)}
          />
        )}
      </main>

      <UserMenu />
    </div>
  );
}
