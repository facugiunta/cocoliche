/**
 * Convierte "HH:MM" a minutos desde medianoche.
 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convierte minutos desde medianoche a "HH:MM".
 */
export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Genera todos los slots de `duration` minutos dentro del rango [startTime, endTime].
 * Retorna array de { startTime, endTime }.
 */
export function generateSlots(startTime, endTime, duration) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const slots = [];

  for (let current = start; current + duration <= end; current += duration) {
    slots.push({
      startTime: minutesToTime(current),
      endTime: minutesToTime(current + duration),
    });
  }

  return slots;
}

/**
 * Devuelve true si dos rangos horarios se solapan.
 * Formato esperado: "HH:MM"
 */
export function slotsOverlap(startA, endA, startB, endB) {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);
  return a1 < b2 && a2 > b1;
}
