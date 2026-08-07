import React from 'react'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Genimage from '../components/Genimage';

const Imageform = ({ post, setPost }) => {
    return (
        <div className='flex items-center justify-center flex-col p-2 lg:p-4 h-full bg-gray-800 text-white'>
            <div className='flex items-center justify-center flex-col'>
                <h1 className='font-outfit text-2xl mt-2.5'>Generate Image With <span className='text-3xl font-bitcount'>AI</span></h1>
                <h2 className='font-outfit text-xl'>Write your prompt according to the image you want to generate</h2>
                <form
                    className='w-4/5 mt-10 h-full'
                    action="">
                    <label htmlFor="author"
                        className='font-outfit mb-2 text-lg block'
                    >Author:</label>
                    <input
                        className='h-12  w-full rounded-lg border-2 px-4 py-2'
                        value={post.name}
                        onChange={(e) => setPost({ ...post, name: e.target.value })}
                        type="text" name='name' placeholder='Write your name...' />
                    <label htmlFor="prompt"
                        className='font-outfit mb-2 text-lg mt-5 block'
                    >Image Prompt:</label>
                    <textarea
                        className='h-40 w-full rounded-lg border-2 px-4 py-2'
                        name="prompt" id="prompt" placeholder='Write a detailed prompt about the image...'
                        value={post.prompt}
                        onChange={(e) => setPost({ ...post, prompt: e.target.value })}
                    ></textarea>
                </form>
            </div>
            <div className='flex gap-1.5 mt-5'>
                <button
                    className='bg-blue-600  text-white font-outfit text-lg rounded-lg px-6 py-2 mt-3.5'
                ><AutoAwesomeIcon /> Generate Image</button>
                <button
                    className='bg-emerald-500 text-white font-outfit text-lg rounded-lg px-12 py-2 mt-3.5 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={post.name === "" || post.prompt === "" || post.img === ""}
                ><PostAddIcon /> Post Image</button>
            </div>
            <Genimage src={post.img} />
        </div>
    )
}

export default Imageform