/*
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Dashboard.css";

type DonanteEstado = "Pendiente" | "Aprobada" | "Rechazada" | "Desaprobada";

interface Donante {
  id: number;
  nombre: string;
  cedula: string;
  email: string;
  fechaDonacion: string;
  telefono: string;
  tipoDonacion: string;
  medioDonar: string;
  montoDonacion: number;
  descripDonacion: string;
  estado: DonanteEstado;
}

export default function DonanteDashboard() {
  const [donantes, setDonantes] = useState<Donante[]>([]);
  const [filteredDonantes, setFilteredDonantes] = useState<Donante[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterTipoDonacion, setFilterTipoDonacion] = useState<string>("");

  useEffect(() => {
    fetchDonantes();
  }, []);

  const fetchDonantes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/donante");
      const data = await response.json();
      const donantesTransformados = data.map((donante: any) => ({
        id: donante.id,
        nombre: donante.nombre,
        cedula: donante.cedula,
        email: donante.email,
        fechaDonacion: donante.fechaDonacion,
        telefono: donante.telefono,
        tipoDonacion: donante.tipoDonacion,
        medioDonar: donante.medioDonar,
        montoDonacion: donante.montoDonacion,
        descripDonacion: donante.descripDonacion,
        estado: donante.estadoAprobado ? "Aprobada" : "Pendiente",
      }));
      setDonantes(donantesTransformados);
      setFilteredDonantes(donantesTransformados);
    } catch (error) {
      toast.error("Error al obtener los datos de donantes. Inténtalo nuevamente.");
    }
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
    applyFilters(e.target.value, filterTipoDonacion);
  };

  const handleTipoDonacionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTipoDonacion(e.target.value);
    applyFilters(filterDate, e.target.value);
  };

  const applyFilters = (date: string, tipoDonacion: string) => {
    let filtered = donantes;

    if (date) {
      filtered = filtered.filter((donante) => donante.fechaDonacion === date);
    }

    if (tipoDonacion) {
      filtered = filtered.filter((donante) => donante.tipoDonacion.toLowerCase().includes(tipoDonacion.toLowerCase()));
    }

    setFilteredDonantes(filtered);
  };
  {/*
  const handleAprobar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/donante/${id}/estado?nuevoEstado=true`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Error al aprobar la donación.");
      }
      setDonantes(donantes.map((d) => (d.id === id ? { ...d, estado: "Aprobada" } : d)));
      setFilteredDonantes(filteredDonantes.map((d) => (d.id === id ? { ...d, estado: "Aprobada" } : d)));
      toast.success("¡Donación aprobada con éxito!");
    } catch (error) {
      toast.error("Error al aprobar la donación. Inténtalo nuevamente.");
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/donante/${id}/estado?nuevoEstado=false`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Error al desaprobar la donación.");
      }
      setDonantes(donantes.map((d) => (d.id === id ? { ...d, estado: "Desaprobada" } : d)));
      setFilteredDonantes(filteredDonantes.map((d) => (d.id === id ? { ...d, estado: "Desaprobada" } : d)));
      toast.info("Donación desaprobada correctamente.");
    } catch (error) {
      toast.error("Error al desaprobar la donación. Inténtalo nuevamente.");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta donación?");
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:8080/api/donante/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error al eliminar la donación.");
      }
      setDonantes(donantes.filter((d) => d.id !== id));
      setFilteredDonantes(filteredDonantes.filter((d) => d.id !== id));
      toast.success("Donación eliminada correctamente.");
    } catch (error) {
      toast.error("Error al eliminar la donación. Inténtalo nuevamente.");
    }
  }; /}

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard de Donantes</h1>

      {/* Filtros /}
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="date-filter">Filtrar por Fecha:</label>
          <input type="date" id="date-filter" value={filterDate} onChange={handleDateFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="tipoDonacion-filter">Filtrar por Tipo de Donación:</label>
          <select id="tipoDonacion-filter" value={filterTipoDonacion} onChange={handleTipoDonacionFilterChange}>
            <option value="">Todas</option>
            <option value="Monetaria">Monetaria</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Ropa">Ropa</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Tabla de Donantes /}
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Email</th>
              <th>Fecha de Donación</th>
              <th>Teléfono</th>
              <th>Tipo de Donación</th>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonantes.map((donante) => (
              <tr key={donante.id}>
                <td>{donante.id}</td>
                <td>{donante.nombre}</td>
                <td>{donante.cedula}</td>
                <td>{donante.email}</td>
                <td>{donante.fechaDonacion}</td>
                <td>{donante.telefono}</td>
                <td>{donante.tipoDonacion}</td>
                <td>{donante.montoDonacion}</td>
                <td>{donante.descripDonacion}</td>
                <td><span className={`estado-badge ${donante.estado.toLowerCase()}`}>{donante.estado}</span></td>
               {/* <td>
                  <div className="acciones-container">
                    <button onClick={() => handleAprobar(donante.id)} disabled={donante.estado === "Aprobada"} className="btn-accion btn-aprobar" title="Aprobar">
                      <Check size={16} />
                    </button>
                    <button onClick={() => handleRechazar(donante.id)} className="btn-accion btn-rechazar" title="Desaprobar">
                      <X size={16} />
                    </button>
                    <button onClick={() => handleEliminar(donante.id)} className="btn-accion btn-eliminar" title="Eliminar">
                      <X size={16} />
                    </button>
                  </div>
                </td> /}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
*/