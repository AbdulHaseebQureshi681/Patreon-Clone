import React from 'react'
import Image from 'next/image'
import { FaHeart, FaComment, FaShare } from 'react-icons/fa'
const PostTemplate = ({post}) => {
  return (
    <div className="post-template my-10  flex flex-col justify-center items-center text-left">
    <div className="items overflow-hidden w-[650px] rounded-lg border border-gray-700 bg-gray-800 ">

    <div className="img w-full ">
      <Image src={post.image} alt="" width={650} height={650} />
    </div>
    <div className="p-6 flex flex-col">
      
    <div className="title text-2xl font-bold mb-1">
      <h2>{post.title}</h2>
    </div>
    <div className="time mb-2 text-slate-400 text-sm">{post.time}</div>
    <div className="descrip">{post.description}</div>
    <div className="viewpost text-sm underline my-2 cursor-pointer hover:text-blue-500">View post</div>
    <div className="iconsbar flex justify-between text-gray-400">
      <div className='flex items-center gap-4'>

    <div className='flex items-center gap-2 cursor-pointer hover:text-red-500'>
      <FaHeart size={20} aria-hidden="true" />
      <div>{post.likes}</div>

    </div>
    <div className='flex items-center gap-2 cursor-pointer hover:text-blue-500'>
      <FaComment size={20} aria-hidden="true" />
      <div>{post.comments}</div>
      </div>
      </div>
      <div className="share flex items-center gap-2 cursor-pointer hover:text-blue-500">
        <FaShare size={20} aria-hidden="true" />
        <div>Share</div>
      </div>
    </div>
    </div>
    </div>
  </div>
  )
}

export default PostTemplate