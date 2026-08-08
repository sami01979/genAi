import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:3000/api"
})

export const GetPosts = async () => await API.get("/post")
export const CreatePost = async (data) => await API.post("/post", data)
export const GenerateAiImage = async (data) => await API.post("/generateImage", data)