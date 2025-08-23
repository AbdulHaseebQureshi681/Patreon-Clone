import React from 'react'
import Image from 'next/image'
import { FaHeart, FaComment, FaShare } from 'react-icons/fa'
import Link from 'next/link'
const PostTemplate = ({post}) => {
  return (
    <div className="post-template my-6 sm:my-10 flex flex-col justify-center items-center text-left px-4">
    <div className="items overflow-hidden w-full max-w-[650px] rounded-lg border border-gray-700 bg-gray-800 ">

    <div className="img w-full ">
      <Image src={post.image} alt="" width={650} height={650} className="w-full h-auto object-cover" />
    </div>
    <div className="p-6 flex flex-col">
      
    <div className="title text-xl sm:text-2xl font-bold mb-1">
      <h2>{post.title}</h2>
    </div>
    <div className="time mb-2 text-slate-400 text-xs sm:text-sm">
      {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
    </div>
    <div className="descrip text-sm sm:text-base">{post.content.slice(0, 100)}...</div>
    <Link href={`/post/${post._id}`} className="viewpost text-sm underline my-2 cursor-pointer hover:text-blue-500">View post</Link>
    <div className="iconsbar flex justify-between items-center text-gray-400 mt-2">
      <div className='flex items-center gap-4'>

    <div className='flex items-center gap-2 cursor-pointer hover:text-red-500'>
      <FaHeart size={20} aria-hidden="true" />
      <div>{post? post?.likes?.length : 0}</div>

    </div>
    <div className='flex items-center gap-2 cursor-pointer hover:text-blue-500'>
      <FaComment size={20} aria-hidden="true" />
      <div>{post? post?.comments?.length : 0}</div>
      </div>
      </div>
      <div className="share flex items-center gap-2 cursor-pointer hover:text-blue-500 mt-2 sm:mt-0">
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