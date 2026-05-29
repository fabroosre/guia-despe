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

  const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');

  // Comparar strings de tiempo (HH:mm)
  if (diaInfo.apertura <= diaInfo.cierre) {
    // Horario normal (ej: 09:00 a 18:00)
    return currentTimeStr >= diaInfo.apertura && currentTimeStr <= diaInfo.cierre;
  } else {
    // Cruza la medianoche (ej: 22:00 a 02:00)
    return currentTimeStr >= diaInfo.apertura || currentTimeStr <= diaInfo.cierre;
  }
};
