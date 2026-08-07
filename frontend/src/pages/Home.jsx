import React from 'react'
import Heading from '../components/Heading'
import Searchbar from '../components/Searchbar'
import Cardsection from '../components/Cardsection'

const Home = () => {
  const item = {
    img:"https://media.istockphoto.com/id/2225321683/photo/osaka-japan-may-2-2025-dotonbori-side-streets-at-night-with-bars-restaurants.webp?a=1&b=1&s=612x612&w=0&k=20&c=w1xOMEqhzCZS-yq1-mTJArAIDsp3l7qsgluLbwjgjFI=",
    author:"sami",
    prompt:"domethis"
  }
  return (
    <div>
      <Heading/>
      <Searchbar/>
      <Cardsection item={item}/>
    </div>
  )
}

export default Home
