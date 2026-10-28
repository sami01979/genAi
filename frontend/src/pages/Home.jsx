import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigationType } from 'react-router-dom'
import Heading from '../components/Heading'
import Searchbar from '../components/Searchbar'
import Cardsection from '../components/Cardsection'
import { GetPosts } from '../api'

const Home = () => {
  const navType = useNavigationType()

  const [posts, setPost] = useState([])
  const [search, setSearch] = useState(() =>
    navType === 'POP' ? sessionStorage.getItem('homeSearch') || "" : ""
  )
  const [filteredpost, setFilteredpost] = useState([])
  const [loading, setLoading] = useState(true)

  const getPosts = async () => {
    setLoading(true)
    try {
      const res = await GetPosts()
      setPost(res?.data?.data || [])
      setFilteredpost(res?.data?.data || [])
    } catch (err) {
      console.log(err)
      console.log("something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  useEffect(() => {
    sessionStorage.setItem('homeSearch', search)
  }, [search])


  useLayoutEffect(() => {
    if (loading) return
    if (navType === 'POP') {
      const y = sessionStorage.getItem('homeScrollY')
      if (y) window.scrollTo(0, parseInt(y, 10))
    }
  }, [loading])

  const handleDelete = (id) => {
    setPost((prev) => prev.filter((item) => item._id !== id))
    setFilteredpost((prev) => prev.filter((item) => item._id !== id))
  }

  useEffect(() => {
    if (!search) {
      setFilteredpost(posts)
      return
    }
    const searchFilteredpost = posts.filter((item) => {
      const promptMatch = item?.prompt?.toLowerCase().includes(search.toLowerCase());
      const authorMatch = item?.name?.toLowerCase().includes(search.toLowerCase());
      return promptMatch || authorMatch;
    })
    setFilteredpost(searchFilteredpost)
  }, [posts, search])

  return (
    <div>
      <Heading />
      <Searchbar search={search} setSearch={setSearch} />
      {
        loading ? (
          <p className='text-center p-10 font-outfit'>Loading posts...</p>
        ) : filteredpost.length === 0 ? (
          <p className='text-center p-10 font-outfit'>No posts found</p>
        ) : (
          <div
            onClickCapture={() => sessionStorage.setItem('homeScrollY', String(window.scrollY))}
            className='grid grid-cols-1 gap-2 p-0 w-full sm:grid-cols-2 sm:gap-4 sm:p-2 lg:grid-cols-4 lg:p-4'
          >
            {filteredpost
              .slice()
              .reverse()
              .map((item) => (
                <Cardsection key={item._id} item={item} onDelete={handleDelete}/>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Home