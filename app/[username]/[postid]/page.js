"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { FaHeart, FaComment, FaShare } from 'react-icons/fa'
import { useAuthStore } from '@/store/dashboardHandler'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

const PostPage = () => {
    const {post, error, alreadyLiked} = useAuthStore()
    const {postid} = useParams()
    const {data: session} = useSession()

    const {getPost, incrementLike} = useAuthStore()
 
    useEffect(() => {
      if (postid) {
        const decoded = decodeURIComponent(postid)
       
        getPost(decoded)
      }

    }, [postid, getPost])
  return (
    <div>
         <div className="post-template my-6 sm:my-10 flex flex-col justify-center items-center text-left px-4">
            <div className="items overflow-hidden w-full max-w-[650px] rounded-lg border border-gray-700 bg-gray-800 ">
        
            <div className="img w-full ">
              <Image src={post? post?.image : "/pfp.jpg"} alt="" width={650} height={650} className="w-full h-auto object-cover" />
            </div>
            <div className="p-6 flex flex-col">
              
            <div className="title text-xl sm:text-2xl font-bold mb-1">
              <h2>{post?.title}</h2>
            </div>
            <div className="time mb-2 text-slate-400 text-xs sm:text-sm">
              {new Date(post?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <div className="descrip text-sm sm:text-base">{post?.content}</div>
            
            <div className="iconsbar flex justify-between items-center text-gray-400 mt-2">
              <div className='flex items-center gap-4'>
        
            {(() => {
              const userIdStr = session?.user?.id || session?.user?.sub || session?.user?._id;
              const likes = Array.isArray(post?.likes) ? post.likes : [];
              const isLiked = !!(userIdStr && likes.some((l) => String(l) === String(userIdStr)));
              return (
                <div onClick={() => { if(session) incrementLike(post?._id, session) }} className={'flex items-center gap-2 cursor-pointer hover:text-red-500' + (isLiked ? ' text-red-500' : '')}>
                  <FaHeart size={20} aria-hidden="true" />
                  <div>{post? post?.likes?.length : 0}</div>
                </div>
              );
            })()}
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
    </div>
  )
}

export default PostPage