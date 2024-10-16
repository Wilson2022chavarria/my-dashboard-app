import React, { useState } from 'react'
import { Solicitud} from '../types'

type ModalProps = {
  type: 'add' | 'details' | 'update'
  solicitud?: Solicitud | null
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function Modal({ type, solicitud, onClose, onSubmit }: ModalProps) {
  const [formData, setFormData] = useState<Partial<Solicitud>>(
    type === 'add' 
      ? {
          nombre: '',
          apellidos: '',
          cedula: '',
          email: '',
          telefono: '',
          tipoSolicitud: '',
          estado: 'Pendiente'
        }
      : solicitud || {}
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal" onClick={onClose}>✖</button>
        <h2>
          {type === 'add' && "Agregar Nueva Solicitud"}
          {type === 'details' && "Detalles de la Solicitud"}
          {type === 'update' && "Actualizar Estado de la Solicitud"}
        </h2>
        {type === 'details' ? (
          <div className="solicitud-details">
            {Object.entries(solicitud || {}).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {type === 'add' && (
              <>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos:</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cedula">Cédula:</label>
                  <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formData.cedula || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tipoSolicitud">Tipo de Solicitud:</label>
                  <select
                    id="tipoSolicitud"
                    name="tipoSolicitud"
                    value={formData.tipoSolicitud || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Voluntariado">Voluntariado</option>
                    <option value="Donación">Donación</option>
                    <option value="Asociación">Asociación</option>
                    <option value="Registrar Adulto Mayor">Registrar Adulto Mayor</option>
                  </select>
                </div>
              </>
            )}
            {type === 'update' && (
              <div className="form-group">
                <label htmlFor="estado">Nuevo Estado:</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>
            )}
            <button type="submit" className="submit-button">
              {type === 'add' ? 'Agregar Solicitud' : 'Actualizar Estado'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}