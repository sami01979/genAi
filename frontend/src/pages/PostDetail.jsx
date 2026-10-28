import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { GetPost, ToggleLike, AddComment, DeletePost } from '../api'
import { useAuth } from '../context/AuthContext'

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await GetPost(id)
        setPost(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user])

  const liked = !!user && !!post && post.likes.includes(user.id)

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await ToggleLike(id)
      setPost((p) => ({ ...p, likes: res.data.data.likes }))
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      const res = await AddComment(id, text)
      setPost((p) => ({ ...p, comments: res.data.data }))
      setText('')
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post comment')
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently?')) return
    setDeleting(true)
    try {
      await DeletePost(id)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this post')
      setDeleting(false)
    }
  }

  if (loading) return <p className='p-6 font-outfit'>Loading...</p>
  if (error) return <p className='p-6 font-outfit text-red-600'>{error}</p>

  return (
    <div className='max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2 font-outfit'>
      <img src={post.img} alt="" className='w-full rounded-lg object-cover' />

      <div className='flex flex-col gap-4'>
        <div>
          <p className='text-sm text-gray-500'>Created by</p>
          {post.owner ? (
            <Link
              to={`/user/${post.owner._id}`}
              className='text-xl font-semibold hover:underline'
            >
              {post.owner.name}
            </Link>
          ) : (
            <span className='text-xl font-semibold'>Unknown user</span>
          )}
        </div>

        <div>
          <p className='text-sm text-gray-500'>Prompt</p>
          <p className='text-lg'>{post.prompt}</p>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>
          <button
            onClick={handleLike}
            className='flex items-center gap-2 w-fit cursor-pointer'
          >
            {liked
              ? <FavoriteIcon className='text-red-500' />
              : <FavoriteBorderIcon />}
            <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
          </button>

          {post.canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className='flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded disabled:opacity-50 cursor-pointer'
            >
              <DeleteForeverIcon fontSize='small' />
              {deleting ? 'Deleting...' : 'Delete post'}
            </button>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <h2 className='text-lg font-semibold'>
            Comments ({post.comments.length})
          </h2>

          {user ? (
            <form onSubmit={handleComment} className='flex gap-2'>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                placeholder='Add a comment...'
                className='flex-1 border-2 rounded px-3 py-2 outline-none'
              />
              <button
                type='submit'
                disabled={posting || !text.trim()}
                className='bg-black text-white px-4 rounded disabled:opacity-50 cursor-pointer'
              >
                {posting ? '...' : 'Post'}
              </button>
            </form>
          ) : (
            <p className='text-gray-600'>
              <Link to='/login' className='underline'>Log in</Link> to like or comment.
            </p>
          )}

          <div className='flex flex-col gap-3 max-h-96 overflow-y-auto'>
            {[...post.comments].reverse().map((c) => (
              <div key={c._id} className='bg-gray-200 rounded p-3'>
                <div className='flex items-center justify-between'>
                  {c.user ? (
                    <Link to={`/user/${c.user._id}`} className='font-medium hover:underline'>
                      {c.user.name}
                    </Link>
                  ) : (
                    <span className='font-medium'>Deleted user</span>
                  )}
                  <span className='text-xs text-gray-500'>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className='wrap-break-word'>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail