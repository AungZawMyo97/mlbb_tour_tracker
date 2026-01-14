/**
 * Tournament status colors for UI display
 */
export const TOURNAMENT_STATUS_COLORS = {
  ongoing: "bg-green-500",
  upcoming: "bg-blue-500",
  completed: "bg-gray-500",
};

/**
 * Get status color class for tournament status
 * @param {string} status - Tournament status
 * @returns {string} Tailwind CSS class
 */
export function getTournamentStatusColor(status) {
  return TOURNAMENT_STATUS_COLORS[status] || TOURNAMENT_STATUS_COLORS.completed;
}

/**
 * Replace M5 with M7 in tournament names for branding consistency
 * @param {string} name - Tournament name
 * @returns {string} Updated tournament name
 */
export function normalizeTournamentName(name) {
  if (!name) return "";
  return name.replace(/M5/gi, "M7");
}
