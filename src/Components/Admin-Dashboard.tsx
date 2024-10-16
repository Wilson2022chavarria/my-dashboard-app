
   /* import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import GaleriaAdmin from '../Components/GaleríaAdmin'; // Importa el componente de galería
import '../styles/admin-dashboard.css';
import { SearchType, Solicitud } from '../types';
import Modal from './Modal';
import OverviewGrid from './Overview-Grid';
import UserMenu from './UserMenu';


    
    export default function AdminDashboard() {
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [searchType, setSearchType] = useState<SearchType>('nombre');
      const [searchQuery, setSearchQuery] = useState('');
      const [activeTab, setActiveTab] = useState('overview');
      const [modalOpen, setModalOpen] = useState(false);
      const [modalType, setModalType] = useState<'add' | 'details' | 'update'>('add');
      const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
      const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
      const [loading, setLoading] = useState(true); // Estado de carga
    
     
      useEffect(() => {
        const fetchDatos = async () => {
          try {
            const [voluntariadoResponse, donantesResponse] = await Promise.all([
              fetch('http://localhost:8080/api/voluntariado'),
              fetch('http://localhost:8080/api/donante') // Corregido
            ]);
      
            if (!voluntariadoResponse.ok) {
              throw new Error('Error al cargar los datos de voluntariado');
            }
            if (!donantesResponse.ok) {
              throw new Error('Error al cargar los datos de donantes');
            }
      
            const voluntariadoData = await voluntariadoResponse.json();
            const donantesData = await donantesResponse.json();
      
            console.log('Voluntariado Data:', voluntariadoData);
            console.log('Donantes Data:', donantesData);
            
          
            const solicitudesVoluntariado = voluntariadoData.map((voluntariado: any) => ({
              id: voluntariado.id,
              nombre: voluntariado.nombre || 'Sin nombre',
              apellidos: voluntariado.apellidos || 'Sin apellidos',
              cedula: voluntariado.cedula,
              email: voluntariado.email,
              telefono: voluntariado.telefono,
              fechaIngreso: voluntariado.fechaNacimiento || 'Fecha no disponible',
              tipoSolicitud: 'Voluntariado', // Asignar tipo de solicitud
              estado: voluntariado.estadoAprobado ? 'Aprobada' : 'Pendiente',
            }));
            
      
            const solicitudesDonantes = donantesData.map((donante: any) => ({
              id: donante.id,
              nombre: donante.nombre,
              apellidos: '', // Si no tiene apellidos en la respuesta, puedes dejarlo en blanco
              cedula: donante.cedula,
              email: donante.email,
              telefono: donante.telefono,
              fechaIngreso: donante.fechaDonacion,  // Actualizar con el campo correcto
              tipoSolicitud: 'Donación',
              estado: donante.estadoAprobado ? 'Aprobada' : 'Pendiente',
            }));
      
            setSolicitudes([...solicitudesVoluntariado, ...solicitudesDonantes]);
            setLoading(false); // Desactivar estado de carga
          } catch (error) {
            console.error('Error al cargar solicitudes y donantes:', error);
            toast.error('Error al cargar los datos. Inténtalo nuevamente.');
            setLoading(false);
          }
        };
      
        fetchDatos();
      }, []);
      
    
      // Función para filtrar solicitudes (reutilizando lógica existente)
      const filteredSolicitudes = useMemo(() => {
        return solicitudes
          .filter(solicitud => {
            if (searchType === 'cedula') {
              return solicitud.cedula.includes(searchQuery);
            } else if (searchType === 'nombre') {
              return solicitud.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
              solicitud.apellidos.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (searchType === 'mes') {
              const [year, month] = searchQuery.split('-');
              return solicitud.fechaIngreso.startsWith(`${year}-${month}`);
            }
            return true;
          })
          .filter(solicitud => {
            if (activeTab === 'voluntariado') return solicitud.tipoSolicitud === 'Voluntariado';
            if (activeTab === 'donaciones') return solicitud.tipoSolicitud === 'Donación';
            if (activeTab === 'asociados') return solicitud.tipoSolicitud === 'Asociación';
            if (activeTab === 'adultos-mayores') return solicitud.tipoSolicitud === 'Registrar Adulto Mayor';
            return true; // Mostrar todas en la pestaña 'solicitudes'
          })
          .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());
      }, [solicitudes, searchType, searchQuery, activeTab]);
    
      // Definir las solicitudes por tipo para OverviewGrid
      const solicitudesPorTipo = useMemo(() => ({
        Voluntariado: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Voluntariado'),
        Donación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Donación'),
        Asociación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Asociación'),
        "Registrar Adulto Mayor": solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Registrar Adulto Mayor'),
      }), [solicitudes]);
    
      if (loading) {
        return <div>Cargando solicitudes y donantes...</div>; // Mostrar estado de carga
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
                { icon: '❤️', label: 'Voluntariado', value: 'voluntariado' },
                { icon: '💰', label: 'Donaciones', value: 'donaciones' },
                { icon: '🤝', label: 'Asociados', value: 'asociados' },
                { icon: '👵', label: 'Adultos Mayores', value: 'adultos-mayores' },
                { icon: '🖼️', label: 'Galería', value: 'galeria' },
                { icon: '📅', label: 'Actividades', value: 'actividades' },
                { icon: '📄', label: 'Todas las Solicitudes', value: 'solicitudes' },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`sidebar-button ${activeTab === item.value ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab(item.value);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </button>
                
              ))}
            </nav>
          </aside>
    
          <div className="main-content">
            <header className="top-bar">
            <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
            </button>
            <h1 className="dashboard-title">Dashboard Administrativo</h1>
            {/* Aquí añadimos el UserMenu /}
            <UserMenu />
              {/* Barra superior /}</header>
    
            <main className="dashboard-content">
              <div className="tabs">
                {/* Tabs de navegación /}
              </div>
    
              {activeTab === 'overview' && (
                <OverviewGrid solicitudesPorTipo={solicitudesPorTipo} />
              )}
              {activeTab === 'galeria' && <GaleriaAdmin />}
    
              {(activeTab === 'voluntariado' || activeTab === 'donaciones' || activeTab === 'asociados' || activeTab === 'adultos-mayores' || activeTab === 'solicitudes') && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      {activeTab === 'voluntariado' && 'Solicitudes de Voluntariado'}
                      {activeTab === 'donaciones' && 'Solicitudes de Donación'}
                      {activeTab === 'asociados' && 'Solicitudes de Asociación'}
                      {activeTab === 'adultos-mayores' && 'Registros de Adultos Mayores'}
                      {activeTab === 'solicitudes' && 'Todas las Solicitudes'}
                    </h2>
                    <p className="card-description">Administra las solicitudes recibidas.</p>
                  </div>
                  <div className="card-content">
                    <div className="search-container">
                      {/* Componente de búsqueda /}
                    </div>
                    <table className="solicitudes-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Apellidos</th>
                          <th>Cédula</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Tipo de Solicitud</th>
                          <th>Estado</th>
                          <th>Fecha de Ingreso</th>
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
                            <td>{solicitud.tipoSolicitud}</td>
                            <td>{solicitud.estado}</td>
                            <td>{solicitud.fechaIngreso}</td>
                            <td>
                              <button className="action-button" onClick={() => openModal('details', solicitud)}>
                                Ver Detalles
                              </button>
                              <button className="action-button" onClick={() => openModal('update', solicitud)}>
                                Actualizar Estado
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="add-solicitud">
                      <button className="add-button" onClick={() => openModal('add')}>Agregar Nueva Solicitud</button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
    
          {modalOpen && (
            <Modal
              type={modalType}
              solicitud={selectedSolicitud}
              onClose={() => setModalOpen(false)}
              onSubmit={modalType === 'add' ? handleAddSolicitud : handleUpdateStatus}
            />
          )}
        </div>
      );
    }
    */



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
      const [activeTab, setActiveTab] = useState('overview');
      const [modalOpen, setModalOpen] = useState(false);
      const [modalType, setModalType] = useState<'add' | 'details' | 'update'>('add');
      const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
      const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchDatos = async () => {
          try {
            const [voluntariadoResponse, donantesResponse] = await Promise.all([
              fetch('http://localhost:8080/api/voluntariado'),
              fetch('http://localhost:8080/api/donante') // Asegúrate de que la URL es correcta
            ]);
    
            if (!voluntariadoResponse.ok) throw new Error('Error al cargar los datos de voluntariado');
            if (!donantesResponse.ok) throw new Error('Error al cargar los datos de donantes');
    
            const voluntariadoData = await voluntariadoResponse.json();
            const donantesData = await donantesResponse.json();
    
            console.log('Voluntariado Data:', voluntariadoData);
            console.log('Donantes Data:', donantesData);
    
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
              apellidos: '',  // No se requiere apellidos para donantes
              cedula: donante.cedula,
              email: donante.email,
              telefono: donante.telefono,
              fechaIngreso: donante.fechaDonacion,  // Asegúrate de que coincide con el campo correcto
              tipoSolicitud: 'Donación',
              estado: donante.estadoAprobado ? 'Aprobada' : 'Pendiente',
            }));
    
            // Combinamos ambas solicitudes
            setSolicitudes([...solicitudesVoluntariado, ...solicitudesDonantes]);
            setLoading(false);
          } catch (error) {
            console.error('Error al cargar solicitudes y donantes:', error);
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
              return solicitud.cedula?.includes(searchQuery);  // Agregamos el signo de interrogación para evitar el error
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
            if (activeTab === 'voluntariado') return solicitud.tipoSolicitud === 'Voluntariado';
            if (activeTab === 'donaciones') return solicitud.tipoSolicitud === 'Donación';
            if (activeTab === 'asociados') return solicitud.tipoSolicitud === 'Asociación';
            if (activeTab === 'adultos-mayores') return solicitud.tipoSolicitud === 'Registrar Adulto Mayor';
            return true; // Mostrar todas en la pestaña 'solicitudes'
          })
          .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime());
      }, [solicitudes, searchType, searchQuery, activeTab]);
      
    
      // Definir solicitudes por tipo para el OverviewGrid
      const solicitudesPorTipo = useMemo(() => ({
        Voluntariado: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Voluntariado'),
        Donación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Donación'),
        Asociación: solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Asociación'),
        "Registrar Adulto Mayor": solicitudes.filter(solicitud => solicitud.tipoSolicitud === 'Registrar Adulto Mayor'),
      }), [solicitudes]);
    
      if (loading) {
        return <div>Cargando solicitudes y donantes...</div>;
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
                { icon: '❤️', label: 'Voluntariado', value: 'voluntariado' },
                { icon: '💰', label: 'Donaciones', value: 'donaciones' },
                { icon: '🤝', label: 'Asociados', value: 'asociados' },
                { icon: '👵', label: 'Adultos Mayores', value: 'adultos-mayores' },
                { icon: '🖼️', label: 'Galería', value: 'galeria' },
                { icon: '📅', label: 'Actividades', value: 'actividades' },
                { icon: '📄', label: 'Todas las Solicitudes', value: 'solicitudes' },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`sidebar-button ${activeTab === item.value ? 'active' : ''}`}
                  onClick={() => { 
                    setActiveTab(item.value);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
    
          <div className="main-content">
            <header className="top-bar">
              <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
              </button>
              <h1 className="dashboard-title">Dashboard Administrativo</h1>
              <UserMenu />
            </header>
    
            <main className="dashboard-content">
              {activeTab === 'overview' && (
                <OverviewGrid solicitudesPorTipo={solicitudesPorTipo} />
              )}
              {activeTab === 'galeria' && <GaleriaAdmin />}
              {['voluntariado', 'donaciones', 'asociados', 'adultos-mayores', 'solicitudes'].includes(activeTab) && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">
                      {activeTab === 'voluntariado' && 'Solicitudes de Voluntariado'}
                      {activeTab === 'donaciones' && 'Solicitudes de Donación'}
                      {activeTab === 'asociados' && 'Solicitudes de Asociación'}
                      {activeTab === 'adultos-mayores' && 'Registros de Adultos Mayores'}
                      {activeTab === 'solicitudes' && 'Todas las Solicitudes'}
                    </h2>
                    <p className="card-description">Administra las solicitudes recibidas.</p>
                  </div>
                  <div className="card-content">
                    <table className="solicitudes-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Apellidos</th>
                          <th>Cédula</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                          <th>Tipo de Solicitud</th>
                          <th>Estado</th>
                          <th>Fecha de Ingreso</th>
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
                            <td>{solicitud.tipoSolicitud}</td>
                            <td>{solicitud.estado}</td>
                            <td>{solicitud.fechaIngreso}</td>
                            <td>
                              <button className="action-button" onClick={() => openModal('details', solicitud)}>
                                Ver Detalles
                              </button>
                              <button className="action-button" onClick={() => openModal('update', solicitud)}>
                                Actualizar Estado
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="add-solicitud">
                      <button className="add-button" onClick={() => openModal('add')}>Agregar Nueva Solicitud</button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
    
          {modalOpen && (
            <Modal
              type={modalType}
              solicitud={selectedSolicitud}
              onClose={() => setModalOpen(false)}
              onSubmit={modalType === 'add' ? handleAddSolicitud : handleUpdateStatus}
            />
          )}
        </div>
      );
    }
    