// API Configuration for different environments
const API_CONFIG = {
    development: {
        baseURL: 'http://localhost:5000'
    },
    production: {
        baseURL: 'http://ec2-54-167-19-199.compute-1.amazonaws.com:5000'
    }
}

const currentEnv = process.env.NODE_ENV || 'development'
export const API_BASE_URL = API_CONFIG[currentEnv].baseURL

// For relative URLs in development, empty string for localhost proxy
export const getApiUrl = (endpoint) => {
    if (process.env.NODE_ENV === 'production') {
        return `${API_BASE_URL}${endpoint}`
    }
    return endpoint // Use relative URL in development with proxy
}

export default API_CONFIG
