export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
