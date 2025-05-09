// Mover funciones auxiliares aquí si es necesario
// Ejemplo:
export const someUtilityFunction = () => {
  // Lógica auxiliar
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  const [, payload] = token.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedPayload.exp < currentTime;
};
