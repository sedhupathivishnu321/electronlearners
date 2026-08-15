export const getAssetUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    if ((window.location.pathname.includes('/electronlearners') || window.location.pathname.includes('/jrlearners'))) {
      return window.location.pathname.includes('/electronlearners') ? `/electronlearners${cleanPath}` : `/jrlearners${cleanPath}`;
    }
  }
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${prefix}${cleanPath}`;
};
