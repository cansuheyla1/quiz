
import axios from 'axios'

const api = axios.create({
    baseURL: "https://quiz-backend-zwvz.onrender.com/api"
})

export default api