// shared/dataMode.ts
export const DATA_SOURCE = (import.meta.env.VITE_DATA_SOURCE || 'supabase').toLowerCase(); 
export const USE_STATIC = DATA_SOURCE === 'static'; // legacy switch if ever needed

// Log the data source at startup for debugging
console.log({ DATA_SOURCE });