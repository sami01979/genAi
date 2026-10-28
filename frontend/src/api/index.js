import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
    console.error("VITE_API_URL is not set")
}

const API = axios.create({
    baseURL: API_URL
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
export const GetPost = async (id) => await API.get(`/post/${id}`)
export const GetUserPosts = async (userId) => await API.get(`/post/user/${userId}`)
export const ToggleLike = async (id) => await API.put(`/post/${id}/like`)
export const AddComment = async (id, text) => await API.post(`/post/${id}/comment`, { text })