import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Genimage from '../components/Genimage';
import { CreatePost, GenerateAiImage } from '../api';
import { useAuth } from '../context/AuthContext'

const Imageform = ({ post, setPost }) => {
    const navigate = useNavigate();
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [posting, setPosting] = useState(false)
    const [authMsg, setAuthMsg] = useState('')

    const genImageFun = async () => {
        if (!user) {
            setAuthMsg('Please login to generate images')
            return
        }
        if (!post.prompt) return
        setAuthMsg('')
        setLoading(true)
        try {
            const res = await GenerateAiImage({ prompt: post.prompt })
            setPost({ ...post, img: `data:image/jpeg;base64,${res?.data?.img}` })
        } catch (error) {
            console.error('Image generation failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const createPostFun = async () => {
        if (!user) {
            setAuthMsg('Please login to post images')
            return
        }
        setAuthMsg('')
        setPosting(true)
        try {
            await CreatePost(post)
            navigate("/")
        } catch (error) {
            console.error('Post creation failed:', error)
        } finally {
            setPosting(false)
        }
    }

    return (
        <div className='flex items-center justify-center flex-col p-2 lg:p-4 h-full bg-gray-800 text-white'>
            <div className='flex items-center justify-center flex-col'>
                <h1 className='font-outfit text-2xl mt-2.5'>Generate Image With <span className='text-3xl font-bitcount'>AI</span></h1>
                <h2 className='font-outfit text-xl'>Write your prompt according to the image you want to generate</h2>
                <form className='w-4/5 mt-10 h-full' action="">
                    <label htmlFor="author" className='font-outfit mb-2 text-lg block'>Author:</label>
                    <input
                        className='h-12  w-full rounded-lg border-2 px-4 py-2'
                        value={post.name}
                        onChange={(e) => setPost({ ...post, name: e.target.value })}
                        type="text" name='name' placeholder='Write your name...' />
                    <label htmlFor="prompt" className='font-outfit mb-2 text-lg mt-5 block'>Image Prompt:</label>
                    <textarea
                        className='h-40 w-full rounded-lg border-2 px-4 py-2'
                        name="prompt" id="prompt" placeholder='Write a detailed prompt about the image...'
                        value={post.prompt}
                        onChange={(e) => setPost({ ...post, prompt: e.target.value })}
                    ></textarea>
                </form>
            </div>

            {authMsg && (
                <p className='text-red-400 font-outfit mt-3'>{authMsg}</p>
            )}

            <div className='flex gap-1.5 mt-5'>
                <button
                    onClick={genImageFun}
                    disabled={loading || post.prompt === ""}
                    className='bg-blue-600  text-white font-outfit text-lg rounded-lg px-6 py-2 mt-3.5 cursor-pointer active:scale-95 active:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed'
                ><AutoAwesomeIcon /> {loading ? 'Generating...' : 'Generate Image'}</button>
                <button
                    className='bg-emerald-500 text-white font-outfit text-lg rounded-lg px-12 py-2 mt-3.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 active:bg-emerald-300 cursor-pointer flex items-center gap-2 justify-center'
                    disabled={posting || post.name === "" || post.prompt === "" || post.img === ""}
                    onClick={createPostFun}
                >
                    {posting ? (
                        <>
                            <span className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                            Posting...
                        </>
                    ) : (
                        <>
                            <PostAddIcon /> Post Image
                        </>
                    )}
                </button>
            </div>

            {loading ? (
                <div className='flex flex-col items-center justify-center mt-6 h-80 w-[37%] rounded-lg border-2 border-dashed border-gray-500'>
                    <div className='h-10 w-10 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin'></div>
                    <p className='mt-3 font-outfit text-gray-300'>Generating Image...</p>
                </div>
            ) : (
                <Genimage src={post.img} />
            )}
        </div>
    )
}

export default Imageform