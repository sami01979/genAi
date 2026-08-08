import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const GetPosts = async () => await API.get("/post")
export const CreatePost = async (data) => await API.post("/post", data)
export const DeletePost = async (id) => await API.delete(`/post/${id}`)
export const GenerateAiImage = async (data) => await API.post("/generateImage", data)
export const RegisterUser = async (data) => await API.post("/auth/register", data)
export const LoginUser = async (data) => await API.post("/auth/login", data)