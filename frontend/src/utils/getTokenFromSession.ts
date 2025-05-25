export const getTokenFromSession = (): string | null => {
  const session = localStorage.getItem('session');
  if (!session) return null;

  try {
    const parsedSession = JSON.parse(session);
    return parsedSession?.token || null;
  } catch (error) {
    console.error('Erro ao parsear a sessão do localStorage:', error);
    return null;
  }
};
