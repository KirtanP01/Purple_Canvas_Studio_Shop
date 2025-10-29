// API Configuration for different environments
const DEFAULT_REMOTE = 'http://ec2-3-93-6-178.compute-1.amazonaws.com:5000'

const API_CONFIG = {
    development: {
        baseURL: DEFAULT_REMOTE // point local dev to remote API
    },
    production: {
        baseURL: DEFAULT_REMOTE
    }
}

const currentEnv = process.env.NODE_ENV || 'development'

// normalize environment override: ignore empty/"undefined" strings
const rawEnv = process.env.REACT_APP_API_URL
const envCandidate = (typeof rawEnv === 'string' && rawEnv.trim() && rawEnv.trim().toLowerCase() !== 'undefined')
  ? rawEnv.trim()
  : API_CONFIG[currentEnv].baseURL

export const API_BASE_URL = envCandidate || ''

// return absolute URL (will be remote in dev and prod unless overridden)
export const getApiUrl = (endpoint) => {
  return API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint
}

export default API_CONFIG