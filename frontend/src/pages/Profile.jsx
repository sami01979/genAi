import React, { useEffect, useState } from 'react'
import { GetPosts } from '../api'
import { useAuth } from '../context/AuthContext'
import Cardsection from '../components/Cardsection'

const Profile = () => {
  const { user } = useAuth()
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyPosts = async () => {
    setLoading(true)
    try {
      const res = await GetPosts()
      const all = res?.data?.data || []
      setMyPosts(all.filter((item) => item.owner === user?.id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyPosts()
  }, [user])

  const handleDelete = (id) => {
    setMyPosts((prev) => prev.filter((item) => item._id !== id))
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center h-full p-10'>
        <p className='font-outfit text-lg'>Please login to view your profile.</p>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-outfit mb-1'>{user.name}'s Posts</h1>
      <p className='text-gray-500 mb-5'>{myPosts.length} image{myPosts.length !== 1 ? 's' : ''} created</p>

      {loading ? (
        <p className='font-outfit'>Loading...</p>
      ) : myPosts.length === 0 ? (
        <p className='font-outfit'>You haven't created any posts yet.</p>
      ) : (
        <div className='grid grid-cols-2 gap-4 p-0.5 lg:p-4 w-full lg:grid-cols-4'>
          {myPosts
            .slice()
            .reverse()
            .map((item) => (
              <Cardsection key={item._id} item={item} onDelete={handleDelete}/>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default Profile