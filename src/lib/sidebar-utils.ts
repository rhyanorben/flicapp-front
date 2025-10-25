/**
 * Utilitários para gerenciar o estado do sidebar
 */

const SIDEBAR_COOKIE_NAME = "sidebar_state";

/**
 * Lê o estado do sidebar do cookie
 * @returns true se o sidebar deve estar aberto, false se deve estar fechado
 */
export function getSidebarStateFromCookie(): boolean {
  if (typeof document === "undefined") {
    return true; // Default no servidor
  }

  const cookies = document.cookie.split("; ");
  const sidebarCookie = cookies.find((cookie) =>
    cookie.startsWith(`${SIDEBAR_COOKIE_NAME}=`)
  );

  if (sidebarCookie) {
    const value = sidebarCookie.split("=")[1];
    return value === "true";
  }

  // Se não houver cookie, retorna true (aberto por padrão)
  return true;
}
