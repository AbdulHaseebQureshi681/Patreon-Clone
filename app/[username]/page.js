"use client"
import React, { useEffect } from 'react'
import DynamicUserMain from '@/components/DynamicUserMain'
import { FaSortAmountDownAlt, FaSearch } from 'react-icons/fa'
import PostTemplate from '@/components/PostTemplate'
import { useAuthStore } from '@/store/dashboardHandler'
import { useParams } from 'next/navigation'
export default function Page({ params }) {
  const { username } = useParams()
  const {getUser, requestedUser, getPosts, posts} = useAuthStore()
 
 
  useEffect(() => {
    if (username) {
      const decoded = decodeURIComponent(username)
      getUser(decoded)
      getPosts(decoded)
    }

  }, [username, getUser, getPosts])
  return (
    <>
      <DynamicUserMain requestedUser={requestedUser} />
      <div className="recentpost text-white flex justify-center items-center font-bold text-xl sm:text-2xl text-center px-4">
        Recent posts by {username}
      </div>
      <div className="post-objs flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-white my-4 px-4">
      <div className='border border-white py-1 px-4 rounded-lg text-sm sm:text-base' >Post type</div>
      <div className='border border-white py-1 px-4 rounded-lg text-sm sm:text-base' >Tier</div>
      <div className='border border-white py-1 px-4 rounded-lg text-sm sm:text-base' >Date</div>
      <div className="sort-icon text-white border border-white p-2 rounded-lg">
        <FaSortAmountDownAlt  size={16} aria-hidden="true" />
      </div>
      <div className="search-icon text-white bg-[#040209] opacity-70 px-2 py-1 rounded-lg flex items-center gap-2 w-full sm:w-auto">
        <FaSearch  size={16} aria-hidden="true" />
      <input className='bg-transparent border-none outline-none w-full sm:w-48 min-w-0' type="text" placeholder='Search posts' />
      </div>
      </div>
      {posts?.length > 0 ? posts?.map((post) => (
        <PostTemplate key={post._id} post={post} />
      )) : (
        <div className="text-white flex justify-center items-center font-bold text-2xl my-10">
          No Posts Found
        </div>
      )}
    </>
  )
}