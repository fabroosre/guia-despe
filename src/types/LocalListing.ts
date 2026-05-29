export type CategoriaRubro = 
  | 'Comercios'

  | 'Gastronomía y Alimentos'
  | 'Hogar'
  | 'Industrias'


  | 'Salud y Belleza'

  | 'Servicios y Vehículos'
  | 'Turismo y Hospedaje'
  | 'Servicios Profesionales'
  | 'Servicios Particulares'
  | 'Institucional'
  | 'Deportes'
  | 'Entretenimiento y Ocio';

export interface HorarioDia {
  abierto: boolean;
  apertura?: string;
  cierre?: string;
}

export interface HorariosSemanales {
  lunes: HorarioDia;
  martes: HorarioDia;
  miercoles: HorarioDia;
  jueves: HorarioDia;
  viernes: HorarioDia;
  sabado: HorarioDia;
  domingo: HorarioDia;
}

export interface UbicacionGPS {
  latitud: number;
  longitud: number;
  googleMapsLink?: string;
}

export interface LocalListing {
  id: string | number;
  nombre: string;
  rubro: CategoriaRubro;
  subcategoria?: string;
  imagenes: string[]; 
  descripcion: string;
  horarios: HorariosSemanales;
  ubicacion: UbicacionGPS | string;
  direccion?: string;
  videoUrl?: string;
  redesSociales?: Record<string, string>;
  telefono?: string;
  whatsapp?: string;
  email?: string;
  esPremium?: boolean;
}
