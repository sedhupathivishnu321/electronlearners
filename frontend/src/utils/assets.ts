export const getLogoPath = () => {
  if (typeof window !== 'undefined' && window.location.pathname.includes('/electronlearners')) {
    return '/electronlearners/logo.png';
  }
  return '/logo.png';
};
