export interface Promotion {
  id: number;
  created_at?: string;
  titulo?: string | null;
  titulo_popup?: string | null;
  nombre_comercio?: string | null;
  descripcion?: string | null;
  texto?: string | null;
  texto_cuerpo?: string | null;
  imagen_url?: string | null;
  link_destino?: string | null;
  link?: string | null;
  categoria?: string | null;
  activo?: boolean | null;
  fecha_inicio?: string | null;
  fecha_vencimiento?: string | null;
}
