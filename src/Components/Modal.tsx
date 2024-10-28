import React, { useState, useEffect } from 'react';
import {
  Solicitud,
  VoluntariadoSolicitud,
  DonanteSolicitud,
  AsociacionSolicitud,
  AdultoMayorSolicitud,
} from '../types';

type ModalProps = {
  type: 'add'| 'details' | 'update' ;
  solicitud?: Solicitud | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onAprobar: (id: number) => void; // Agrego nueva función para aprobar
  onRechazar: (id: number) => void; // Agrego nueva función para rechazar
};

export default function Modal({
  type,
  solicitud,
  onClose,
  onSubmit,

}: ModalProps) {
  const [formData, setFormData] = useState<Partial<Solicitud>>({});

  // Función para inicializar formData según el tipo de solicitud
  const initializeFormData = (tipoSolicitud: Solicitud['tipoSolicitud']) => {
    switch (tipoSolicitud) {
      case 'Voluntariado':
        return {
          nombre: '',
          apellido1: '',
          apellido2: '',
          cedula: '',
          email: '',
          telefono: '',
          comentarios: '',
          tipoSolicitud: 'Voluntariado',
          estadouser: 'Pendiente',
          estado: 'Pendiente',
        } as VoluntariadoSolicitud;
      case 'Donación':
        return {
          nombre: '',
          apellido1: '',
          apellido2: '',
          cedula: '',
          email: '',
          telefono: '',
          tipoDonacion: '',
          medioDonar: '',
          montoDonacion: 0,
          descripDonacion: '',
          tipoSolicitud: 'Donación',
          estadouser: 'Pendiente',
          estado: 'Pendiente',
        } as DonanteSolicitud;
      case 'Asociación':
        return {
          nombre: '',
          apellido1: '',
          apellido2: '',
          cedula: '',
          email: '',
          telefono: '',
          direccion:'',
          ocupacion: '',
          fecha:'',
          observaciones: '',
          tipoSolicitud: 'Asociación',
          estadouser: 'Pendiente',
          estado: 'Pendiente',
        } as AsociacionSolicitud;
      case 'RegistrarAdultoMayor':
        return {
          nombre: '',
          apellido1: '',
          apellido2: '',
          cedula: '',
          email: '',
          telefono: '',
          fechaNacimiento: '',
          fechaRegistro: '',
          genero: '',
          patologías: '',
          medicamento: '',
          dosis: '',
          nombreEncargado: '',
          apellido1Encargado: '',
          apellido2Encargado: '',
          cedulaEncargado: '',
          emailEncargado: '',
          telefonoEncargado: '',
          fechaNacimientoEncargado: '',
          generoEncargado: '',
          tipoSolicitud: 'RegistrarAdultoMayor',
          estadouser: 'Pendiente',
          estado: 'Pendiente',
        } as AdultoMayorSolicitud;
      default:
        return {};
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    
    onSubmit(formData);
  };

  const renderCamposDinamicos = () => {
    switch (formData.tipoSolicitud) {
      case 'Voluntariado':
        return (
          <div className="form-group">
            <label htmlFor="comentarios">Comentarios:</label>
            <input
              type="text"
              id="comentarios"
              name="comentarios"
              value={formData.comentarios || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 'Donación':
        return (
          <>
            <div className="form-group">
              <label htmlFor="tipoDonacion">Tipo de Donación:</label>
              <input
                type="text"
                id="tipoDonacion"
                name="tipoDonacion"
                value={formData.tipoDonacion || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="montoDonacion">Monto de Donación:</label>
              <input
                type="number"
                id="montoDonacion"
                name="montoDonacion"
                value={formData.montoDonacion || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'Asociación':
        return (
          <div className="form-group">
            <label htmlFor="ocupacion">Ocupación:</label>
            <input
              type="text"
              id="ocupacion"
              name="ocupacion"
              value={formData.ocupacion || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 'RegistrarAdultoMayor':
        return (
          <>
            <div className="form-group">
              <label htmlFor="fechaRegistro">Fecha de Registro:</label>
              <input
                type="date"
                id="fechaRegistro"
                name="fechaRegistro"
                value={formData.fechaRegistro || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="patologias">Patologías:</label>
              <input
                type="text"
                id="patologias"
                name="patologias"
                value={formData.patologías || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal" onClick={onClose}>
          ✖
        </button>

        {type === 'details' ? (
          <div className="solicitud-details">
            {Object.entries(solicitud || {}).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="apellido1">Primer Apellido:</label>
              <input
                type="text"
                id="apellido1"
                name="apellido1"
                value={formData.apellido1 || ''}
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
                <option value="RegistrarAdultoMayor">Registrar Adulto Mayor</option>
              </select>
            </div>

            {renderCamposDinamicos()}
          </form>
        )}

       
      </div>

      
    </div>
  );
}
