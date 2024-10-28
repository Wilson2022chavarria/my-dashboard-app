export type Solicitud = 

  | VoluntariadoSolicitud
  | DonanteSolicitud
  | AdultoMayorSolicitud
  | AsociacionSolicitud;

  

  export type VoluntariadoSolicitud = {
    id: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
    fechaNacimiento:string;
    telefono: string;
    tipoSolicitud: 'Voluntariado';
    comentarios?: string;
    estadouser:string;
  estado: string
  };
  
  export type DonanteSolicitud = {
    id: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
    fechaDonacion:string;
    telefono: string;
    tipoSolicitud: 'Donación';
    tipoDonacion:string;
    medioDonar:string;
    montoDonacion: number; // <--- Campo para "Donación"
    descripDonacion:string;
   
    estadouser:string;
    estado:string
  };
  
  export type AdultoMayorSolicitud = {
    id: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
    telefono: string;
    tipoSolicitud: 'RegistrarAdultoMayor';
    fechaNacimiento: string; // <--- Campo específico para "Adulto Mayor"
    fechaRegistro: string;  // <--- Este campo pertenece a "Voluntariado"
    genero:string;
    patologías: string;
    medicamento:string;
    dosis: string;

    nombreEncargado: string,
    apellido1Encargado:string,
    apellido2Encargado:string,
    cedulaEncargado:string,
    emailEncargado:string,
    telefonoEncargado:string,
    fechaNacimientoEncargado:string,
    generoEncargado:string,
    
    estadouser:string;
    estado:string
  };
  
  export type AsociacionSolicitud = {
    id: string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    cedula: string;
    email: string;
    telefono: string;
    direccion: string;
    tipoSolicitud: 'Asociación';
    ocupacion: string;  // <--- Campo para "Asociación"
    fecha:string;
    observaciones?: string;
    
    estadouser:string;
    estado:string
  };
  export type SearchType = "cedula" | "nombre" | "mes"