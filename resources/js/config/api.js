const config = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  timeout: 30000,
  
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  withCredentials: true,
  crossDomain: true
}

export default config