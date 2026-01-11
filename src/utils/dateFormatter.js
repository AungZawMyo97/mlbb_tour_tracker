/**
 * Format date from API response
 * @param {string} dateString - ISO date string from API
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatMatchDate(dateString, options = {}) {
  if (!dateString) return 'TBA'
  
  try {
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'TBA'
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
    
    const formatOptions = { ...defaultOptions, ...options }
    
    return date.toLocaleDateString('en-US', formatOptions)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'TBA'
  }
}

/**
 * Format date with time
 * @param {string} dateString - ISO date string from API
 * @returns {string} Formatted date and time string
 */
export function formatMatchDateTime(dateString) {
  if (!dateString) return 'TBA'
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) return 'TBA'
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch (error) {
    console.error('Error formatting date time:', error)
    return 'TBA'
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string} dateString - ISO date string from API
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'TBA'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'TBA'
    
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (Math.abs(diffMins) < 60) {
      return diffMins > 0 ? `in ${diffMins} minutes` : `${Math.abs(diffMins)} minutes ago`
    } else if (Math.abs(diffHours) < 24) {
      return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`
    } else if (Math.abs(diffDays) < 7) {
      return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`
    } else {
      return formatMatchDate(dateString)
    }
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'TBA'
  }
}
