import { useState, useEffect, useCallback } from 'react';
import type { LocalListing, CategoriaRubro, HorariosSemanales, UbicacionGPS } from '../types/LocalListing';
import { supabase } from '../lib/supabaseClient';

interface UseLocalitiesState {
  data: LocalListing[];
  loading: boolean;
  error: string | null;
}

interface UseLocalitiesReturn extends UseLocalitiesState {
  refetch: () => Promise<void>;
}

export const useLocalities = (): UseLocalitiesReturn => {
  const [state, setState] = useState<UseLocalitiesState>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchLocalities = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Intentamos obtener los datos de la tabla 'Guia-Despe'
      const { data, error } = await supabase
        .from('Guia-Despe')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No se recibieron datos de la base de datos');
      }

      const parsedLocalities: LocalListing[] = data.map((item: any, index: number) => {
        // Mapeo basado en los nombres de columnas reales de Supabase
        const imagenesValidas = [
          item['Imagen 1'],
          item['Imagen 2'],
          item['Imagen 3'],
          item['Imagen 4']
        ].filter(img => img && img !== '');

        return {
          id: item.id || `loc_${index}_${Date.now()}`,
          nombre: item['Nombre'] || 'Sin Nombre',
          rubro: parsearRubro(item['Categoría']),
          subcategoria: item['Subcategoría'],
          descripcion: item['Descripción'] || 'Sin descripción disponible',
          imagenes: imagenesValidas.length > 0 ? imagenesValidas : [`https://picsum.photos/400/225?random=${index}`],
          horarios: parsearHorarios(item['Horarios']),
          ubicacion: parsearUbicacion('', '', item['Ubicación'] || ''),
          direccion: item['dirección'] || item['direccion'] || item['Dirección'] || item['Direccion'] || '',
          videoUrl: item['Video'] || item['video'] ? String(item['Video'] || item['video']).trim() : undefined,
          redesSociales: item['redes-sociales'] || (() => {
            const socials: Record<string, string> = {};
            if (item['Instagram'] || item['instagram']) socials.instagram = item['Instagram'] || item['instagram'];
            if (item['Facebook'] || item['facebook']) socials.facebook = item['Facebook'] || item['facebook'];
            if (item['TikTok'] || item['tiktok']) socials.tiktok = item['TikTok'] || item['tiktok'];
            return Object.keys(socials).length > 0 ? socials : undefined;
          })(),
          telefono: item['Teléfono'] || item['telefono'],

          whatsapp: item['WhatsApp'] || item['whatsapp'],
          email: item['Email'] || item['email'],
          esPremium: 
            [item['es_premium'], item['Premium'], item['esPremium']].some(val => 
              val === true || String(val).toLowerCase() === 'true'
            )
        };



      });

      setState({ data: parsedLocalities, loading: false, error: null });

    } catch (err: any) {
      console.error('[useLocalities] Fetch Error: ', err);
      setState({
        data: [],
        loading: false,
        error: err.message || 'Error desconocido al cargar ubicaciones'
      });
    }
  }, []);

  useEffect(() => {
    fetchLocalities();
  }, [fetchLocalities]);

  return { ...state, refetch: fetchLocalities };
};

const parsearRubro = (valor: any): CategoriaRubro => {
  const rubrosPermitidos: CategoriaRubro[] = [
    'Comercios',
    'Gastronomía y Alimentos',
    'Hogar',
    'Industrias',
    'Salud y Belleza',

    'Servicios y Vehículos',
    'Turismo y Hospedaje',
    'Servicios Profesionales',
    'Servicios Particulares',
    'Institucional',
    'Deportes',
    'Entretenimiento y Ocio'
  ];
  const stringValor = String(valor || '').trim();

  // Mapeo especial para compatibilidad con datos antiguos o variantes
  if (stringValor.toLowerCase() === 'compras y comercio' || stringValor.toLowerCase() === 'compras') {
    return 'Comercios';
  }
  if (stringValor.toLowerCase() === 'comunidad e industria' || stringValor.toLowerCase() === 'industria') {
    return 'Industrias';
  }
  if (stringValor.toLowerCase() === 'salud y bienestar' || stringValor.toLowerCase() === 'salud') {
    return 'Salud y Belleza';
  }



  const detectado = rubrosPermitidos.find(r => r.toLowerCase() === stringValor.toLowerCase());
  return detectado || 'Comercios';
};

const parsearUbicacion = (lat?: any, lng?: any, link?: string): UbicacionGPS | string => {
  const cleanLink = (link || '').trim();

  // Si recibimos un string en el campo link que no empieza con http, verificamos si son coordenadas
  if (cleanLink && !lat && !lng) {
    if (cleanLink.startsWith('http')) {
      return cleanLink;
    } else if (cleanLink.includes(',')) {
      const parts = cleanLink.split(',');
      const parsedLat = Number(parts[0]);
      const parsedLng = Number(parts[1]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        return {
          latitud: parsedLat,
          longitud: parsedLng,
          googleMapsLink: `https://maps.google.com/?q=${parsedLat},${parsedLng}`
        };
      }
    }
    return cleanLink;
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (!isNaN(latNum) && latNum !== 0 && !isNaN(lngNum) && lngNum !== 0) {
    return {
      latitud: latNum,
      longitud: lngNum,
      googleMapsLink: cleanLink || `https://maps.google.com/?q=${latNum},${lngNum}`
    };
  }
  return cleanLink || '';
};

const parsearHorarios = (rawHorarios: any): HorariosSemanales => {
  const defaultDia = { abierto: true };
  const fallback: HorariosSemanales = {
    lunes: defaultDia, martes: defaultDia, miercoles: defaultDia,
    jueves: defaultDia, viernes: defaultDia, sabado: defaultDia, domingo: defaultDia
  };

  if (!rawHorarios) return fallback;

  try {
    const parsed = typeof rawHorarios === 'string' ? JSON.parse(rawHorarios) : rawHorarios;
    return { ...fallback, ...parsed };
  } catch (e) {
    return fallback;
  }
};
