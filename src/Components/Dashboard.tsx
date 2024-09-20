import React, { useState } from "react"
import { Check, X, Save, Trash2, Edit, Plus } from "lucide-react"
import "./Dashboard.css"

type SolicitudTipo = "Asociado" | "Voluntariado" | "Donación"
type SolicitudEstado = "Pendiente" | "Aprobada" | "Rechazada"

interface Solicitud {
  id: number
  numero: number
  tipo: SolicitudTipo
  nombre: string
  email: string
  fecha: string
  estado: SolicitudEstado
}

export default function Dashboard() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    { id: 1, numero: 1, tipo: "Asociado", nombre: "Juan Pérez", email: "juan@example.com", fecha: "2023-05-15", estado: "Pendiente" },
    { id: 2, numero: 2, tipo: "Voluntariado", nombre: "María García", email: "maria@example.com", fecha: "2023-05-16", estado: "Pendiente" },
    { id: 3, numero: 3, tipo: "Donación", nombre: "Carlos Rodríguez", email: "carlos@example.com", fecha: "2023-05-17", estado: "Pendiente" },
  ])

  const [nextNumero, setNextNumero] = useState(4)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Solicitud | null>(null)

  const handleAprobar = (id: number) => {
    setSolicitudes(solicitudes.map(s => s.id === id ? { ...s, estado: "Aprobada" } : s))
  }

  const handleRechazar = (id: number) => {
    setSolicitudes(solicitudes.map(s => s.id === id ? { ...s, estado: "Rechazada" } : s))
  }

  const handleGuardar = (id: number) => {
    console.log(`Guardando solicitud ${id}`)
  }

  const handleEliminar = (id: number) => {
    setSolicitudes(solicitudes.filter(s => s.id !== id))
  }

  const handleNuevaSolicitud = () => {
    const nuevaSolicitud: Solicitud = {
      id: Date.now(),
      numero: nextNumero,
      tipo: "Asociado",
      nombre: "Nueva Solicitud",
      email: "nueva@example.com",
      fecha: new Date().toISOString().split('T')[0],
      estado: "Pendiente"
    }
    setSolicitudes([...solicitudes, nuevaSolicitud])
    setNextNumero(nextNumero + 1)
  }

  const handleEditar = (solicitud: Solicitud) => {
    setEditingId(solicitud.id)
    setEditForm(solicitud)
  }

  const handleCancelarEdicion = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleGuardarEdicion = () => {
    if (editForm) {
      setSolicitudes(solicitudes.map(s => s.id === editForm.id ? editForm : s))
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleChangeEditForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [e.target.name]: e.target.value
      })
    }
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard de Solicitudes</h1>
      <button onClick={handleNuevaSolicitud} className="btn-nueva-solicitud">
        <Plus size={20} />
        <span>Nueva Solicitud</span>
      </button>
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                {editingId === solicitud.id ? (
                  <td colSpan={7}>
                    <div className="edit-form">
                      <input
                        name="nombre"
                        value={editForm?.nombre}
                        onChange={handleChangeEditForm}
                        placeholder="Nombre"
                        className="edit-input"
                      />
                      <input
                        name="email"
                        value={editForm?.email}
                        onChange={handleChangeEditForm}
                        placeholder="Email"
                        className="edit-input"
                      />
                      <select
                        name="tipo"
                        value={editForm?.tipo}
                        onChange={handleChangeEditForm}
                        className="edit-select"
                      >
                        <option value="Asociado">Asociado</option>
                        <option value="Voluntariado">Voluntariado</option>
                        <option value="Donación">Donación</option>
                      </select>
                      <input
                        name="fecha"
                        type="date"
                        value={editForm?.fecha}
                        onChange={handleChangeEditForm}
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <button onClick={handleGuardarEdicion} className="btn-accion btn-guardar">Guardar</button>
                        <button onClick={handleCancelarEdicion} className="btn-accion btn-cancelar">Cancelar</button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td>{solicitud.numero}</td>
                    <td>{solicitud.tipo}</td>
                    <td>{solicitud.nombre}</td>
                    <td>{solicitud.email}</td>
                    <td>{solicitud.fecha}</td>
                    <td>
                      <span className={`estado-badge ${solicitud.estado.toLowerCase()}`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        <button onClick={() => handleAprobar(solicitud.id)} disabled={solicitud.estado !== "Pendiente"} className="btn-accion btn-aprobar" title="Aprobar">
                          <Check size={16} />
                        </button>
                        <button onClick={() => handleRechazar(solicitud.id)} disabled={solicitud.estado !== "Pendiente"} className="btn-accion btn-rechazar" title="Rechazar">
                          <X size={16} />
                        </button>
                        <button onClick={() => handleGuardar(solicitud.id)} className="btn-accion btn-guardar" title="Guardar">
                          <Save size={16} />
                        </button>
                        <button onClick={() => handleEliminar(solicitud.id)} className="btn-accion btn-eliminar" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                        <button onClick={() => handleEditar(solicitud)} className="btn-accion btn-editar" title="Editar">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}