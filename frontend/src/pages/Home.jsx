import React, { useState, useEffect } from 'react'
import Heading from '../components/Heading'
import Searchbar from '../components/Searchbar'
import Cardsection from '../components/Cardsection'
import { GetPosts } from '../api'

const Home = () => {
  const [posts, setPost] = useState([])
  const [search, setSearch] = useState("")
  const [filteredpost, setFilteredpost] = useState([])

  const getPosts = async () => {
    await GetPosts()
      .then((res) => {
        setPost(res?.data?.data)
        setFilteredpost(res?.data?.data)
      })
      .catch((err) => {
        console.log(err)
        console.log("something went wrong")
      })
  }

  useEffect(() => {
    getPosts()
  }, [])

  /* search */

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
      <Searchbar search ={search} setSearch={setSearch} />
      {
        filteredpost.length === 0 ? (
          <>no posts found </>
        ) : (
          <div className='grid grid-cols-2 gap-4 p-0.5 lg:p-4 w-full lg:grid-cols-4'>
            {filteredpost
              .slice()
              .reverse()
              .map((item, index) => (
                <Cardsection key={index} item={item} />
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Home