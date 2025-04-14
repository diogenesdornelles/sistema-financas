export const handleUnauthorizedAccess = () => {
  console.log("Acesso não autorizado detectado (401). Encerrando sessão.");
  alert("Acesso não autorizado detectado. Encerrando sessão. Faça o login novamente!")
  localStorage.removeItem("session");
  window.location.href = '/login';
};