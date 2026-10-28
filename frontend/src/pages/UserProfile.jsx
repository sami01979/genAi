import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GetUserPosts } from '../api'
import Cardsection from '../components/Cardsection'

const UserProfile = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await GetUserPosts(userId)
        setProfile(res.data.data.user)
        setPosts(res.data.data.posts)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p._id !== id))

  if (loading) return <p className='p-6 font-outfit'>Loading...</p>
  if (error) return <p className='p-6 font-outfit text-red-600'>{error}</p>

  return (
    <div className='p-4 font-outfit'>
      <h1 className='text-2xl font-semibold'>{profile.name}</h1>
      <p className='text-gray-600 mb-4'>
        {posts.length} {posts.length === 1 ? 'image' : 'images'}
      </p>

      {posts.length === 0 ? (
        <p>No images yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {posts.map((item) => (
            <Cardsection key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserProfile