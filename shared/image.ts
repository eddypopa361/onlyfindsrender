// shared/image.ts
export function resolveImage(pathOrUrl: string) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // already absolute
  
  // Construct Supabase Storage URL from available environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('VITE_SUPABASE_URL not configured, image may not load:', pathOrUrl);
    return pathOrUrl; // fallback to original path
  }
  
  // Build public Supabase Storage URL
  // Format: https://<project>.supabase.co/storage/v1/object/public/images/{file-path}
  const bucketName = 'images'; // assuming images bucket
  const cleanPath = pathOrUrl.replace(/^\/+/, ''); // remove leading slashes
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanPath}`;
}