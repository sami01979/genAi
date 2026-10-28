import "../loadEnv.js"

export const generateImage = async (req, res, next) => {
    try {
        const { prompt } = req.body

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: "Prompt is required" })
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt.trim(), steps: 4 }),
            }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
            console.error("Cloudflare AI error:", response.status, JSON.stringify(data))
            const limitReached = response.status === 429
            return res.status(limitReached ? 429 : 500).json({
                success: false,
                message: limitReached
                    ? "Daily free limit reached. Try again tomorrow."
                    : "Image generation failed. Try again later.",
            })
        }

        // Cloudflare returns raw base64 (JPEG) in data.result.image
        return res.status(200).json({ img: data.result.image })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}