export const getAssetUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    if (window.location.pathname.includes('/electronlearners')) {
      return `/electronlearners${cleanPath}`;
    }
  }
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${prefix}${cleanPath}`;
};
