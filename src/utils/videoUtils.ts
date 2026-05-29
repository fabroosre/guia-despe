/**
 * Extrae el ID de video de una URL de YouTube y devuelve el link de embed.
 * Soporta formatos: 
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const getYoutubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  const cleanUrl = url.trim();
  
  // Expresión regular mejorada para capturar el ID de video (11 caracteres)
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/;
  const match = cleanUrl.match(regExp);

  if (match && match[1]) {
    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null;
};
