import axios from "axios"

const API = axios.create({
    baseURL: "https://ai-mock-interviewer-modern.onrender.com"
})

export default API