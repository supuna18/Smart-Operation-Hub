export const getToken = () => localStorage.getItem('authToken');

export const getUser = () => {
  const raw = localStorage.getItem('authUser');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify({ ...user, password: undefined }));
};

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export const isAdmin = () => {
  const user = getUser();
  const role = user?.role || user?.Role || '';
  return role.toLowerCase().trim() === 'admin';
};

export const isLoggedIn = () => Boolean(getToken() && getUser());
