export function transformDates(obj: unknown): unknown {
  if (obj instanceof Date) return toIsoArt(obj);

  if (Array.isArray(obj)) return obj.map(transformDates);

  if (obj && typeof obj === 'object') {
    const cloned: any = {};
    for (const [k, v] of Object.entries(obj)) cloned[k] = transformDates(v);
    return cloned;
  }
  return obj;
}

function toIsoArt(date: Date | null | undefined): string | null {
  if (!date) return null;

  const artMillis = date.getTime() - 3 * 60 * 60 * 1000;
  const d = new Date(artMillis);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}-03:00`
  );
}
