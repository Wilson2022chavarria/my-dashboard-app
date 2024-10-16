export type Solicitud = {
    id: string
    nombre: string
    apellidos: string
    cedula: string
    email: string
    telefono: string
    tipoSolicitud: string
    estado: string
    fechaIngreso: string
  }

  export interface  Donante {
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
    estado: "Pendiente" | "Aprobada" | "Rechazada";
  }
  
  export type SearchType = "cedula" | "nombre" | "mes"