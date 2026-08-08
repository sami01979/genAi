import "../loadEnv.js"
import { InferenceClient } from "@huggingface/inference"

const client = new InferenceClient(process.env.HF_TOKEN)

export const generateImage = async (req, res, next) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" })
        }

        const imageBlob = await client.textToImage({
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: prompt,
            provider: "auto",
        })

        const arrayBuffer = await imageBlob.arrayBuffer()
        const base64Image = Buffer.from(arrayBuffer).toString("base64")

        return res.status(200).json({ img: base64Image })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}