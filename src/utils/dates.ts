export function parseUtcDate(value: string): Date {
  const normalized = value.replace(' ', 'T');
  return new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : `${normalized}Z`);
}
export function toLocalDateTime(value: string): string {
  const date = parseUtcDate(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
