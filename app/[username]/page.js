"use client"
import React, { useEffect } from 'react'
import DynamicUserMain from '@/components/DynamicUserMain'
import { FaSortAmountDownAlt, FaSearch } from 'react-icons/fa'
import PostTemplate from '@/components/PostTemplate'
import { useAuthStore } from '@/store/dashboardHandler'
import { useParams } from 'next/navigation'
export default function Page({ params }) {
  const { username } = useParams()
  const {getUser, requestedUser} = useAuthStore()
  const post = {
    image: '/temppost.png',
    title: 'Sample Title Image Ahh',
    time: '2 days ago',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore unde repellat fugit officiis repudiandae? Tempore nemo quae molestiae perferendis maiores harum quod dolor veniam animi ratione, repudiandae suscipit. Sit rerum provident illum.',
    likes: 12,
    comments: 12,
  }
 
  useEffect(() => {
    if (username) {
      const decoded = decodeURIComponent(username)
      getUser(decoded)
    }
  }, [username, getUser])
  return (
    <>
      <DynamicUserMain requestedUser={requestedUser} />
      <div className="recentpost text-white flex justify-center items-center font-bold text-2xl">
        Recent posts by {username}
      </div>
      <div className="post-objs flex justify-center items-center gap-2  text-white my-4">
      <div className='border border-white py-1 px-4 rounded-lg' >Post type</div>
      <div className='border border-white py-1 px-4 rounded-lg' >Tier</div>
      <div className='border border-white py-1 px-4 rounded-lg' >Date</div>
      <div className="sort-icon text-white border border-white p-2 rounded-lg">
        <FaSortAmountDownAlt  size={16} aria-hidden="true" />
      </div>
      <div className="search-icon text-white  bg-[#040209] opacity-70 px-2 py-1 rounded-lg flex items-center gap-2 ">
        <FaSearch  size={16} aria-hidden="true" />
      <input className='bg-transparent border-none outline-none' type="text" placeholder='Search posts' />
      </div>
      </div>
      <PostTemplate post={post} />
      <PostTemplate post={post} />
      <PostTemplate post={post} />
    </>
  )
}