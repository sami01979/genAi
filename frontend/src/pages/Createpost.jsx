import React, { useState } from 'react'

import Imageform from '../components/Imageform';

const Createpost = () => {

  const [post, setPost] = useState({
    name:"",
    prompt:"",
    img:"",
  })

  return (
    <div>
      <Imageform post={post} setPost={setPost} />
    </div>
  )
}

export default Createpost
