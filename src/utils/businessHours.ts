import type { HorariosSemanales, HorarioDia } from '../types/LocalListing';

export const isLocalOpen = (horarios: HorariosSemanales): boolean => {
  if (!horarios) return false;

  const now = new Date();
  const dayNames: (keyof HorariosSemanales)[] = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado'
  ];
  
  const currentDayName = dayNames[now.getDay()];
  const diaInfo: HorarioDia = horarios[currentDayName];

  if (!diaInfo || !diaInfo.abierto) {
    return false;
  }

  // Si no hay horarios definidos pero dice que está abierto, asumimos que está abierto (24h o siempre)
  if (!diaInfo.apertura || !diaInfo.cierre) {
    return true;
  }

  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');

  const checkInRange = (time: string, start: any, end: any) => {
    if (typeof start !== 'string' || typeof end !== 'string') return false;
    const s = start.trim();
    const e = end.trim();
    if (!s || !e) return false;

    if (s <= e) return time >= s && time <= e;
    return time >= s || time <= e; // Caso cruce de medianoche
  };

  const ap = diaInfo.apertura;
  const ci = diaInfo.cierre;

  // Detectar si estamos usando modalidad de rangos en los strings (Horario Cortado)
  const apIsRange = typeof ap === 'string' && ap.includes(' a ');
  const ciIsRange = typeof ci === 'string' && ci.includes(' a ');

  if (apIsRange || ciIsRange) {
    let isOpen = false;
    
    if (apIsRange) {
      const [start, end] = (ap as string).split(' a ');
      if (start && end && checkInRange(currentTime, start, end)) isOpen = true;
    }
    
    if (ciIsRange) {
      const [start, end] = (ci as string).split(' a ');
      if (start && end && checkInRange(currentTime, start, end)) isOpen = true;
    }
    
    return isOpen;
  }

  // Caso tradicional: apertura es inicio y cierre es fin (ej: Sábado)
  if (ap && ci) {
    return checkInRange(currentTime, ap, ci);
  }

  return true; // Fallback: si está marcado como abierto pero no hay horas claras
};
