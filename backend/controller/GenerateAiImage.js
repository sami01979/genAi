import "../loadEnv.js"


export const generateImage = async (req, res, next) => {
    try {
        const { prompt } = req.body

        const encodedPrompt = encodeURIComponent(prompt);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Pollinations request failed with status ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        return res.status(200).json({ img: base64Image });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}