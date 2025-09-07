// shared/image.ts
export function resolveImage(pathOrUrl: string) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // already absolute
  // legacy "/uploads/XYZ.webp" → build a public Supabase Storage URL
  const base = import.meta.env.VITE_SUPABASE_PUBLIC_IMAGES_BASE; // e.g. https://<project>.supabase.co/storage/v1/object/public/<bucket>
  return `${base}/${pathOrUrl.replace(/^\/+/, '')}`;
}