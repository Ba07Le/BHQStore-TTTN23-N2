

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000'

export const getImageUrl = (path) => {
  if (!path) return ''


  if (path.startsWith('http')) return path

  
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`
  }

  return `${API_BASE_URL}${path}`
}
