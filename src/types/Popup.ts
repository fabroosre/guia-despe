export interface Popup {
  id: number;
  created_at: string;
  nombre_comercio: string | null;
  imagen_url: string | null;
  titulo_popup: string | null;
  texto_cuerpo: string | null;
  link_destino: string | null;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_vencimiento: string | null;
  categoria: string | null;
}
