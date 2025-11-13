import axios from "axios";

// Используем относительный URL для работы через Nginx proxy
// В production это будет работать через прокси в nginx.conf
// В development можно использовать VITE_API_URL из .env
const apiBaseURL = import.meta.env.VITE_API_URL || "/shispare";

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
})

export default api;