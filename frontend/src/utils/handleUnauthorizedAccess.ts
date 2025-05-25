export const handleUnauthorizedAccess = () => {
  alert('Acesso não autorizado detectado. Encerrando sessão. Faça o login novamente!');
  localStorage.removeItem('session');
  window.location.href = '/login';
};
