"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { FaHeart, FaComment, FaShare } from 'react-icons/fa'
import { useAuthStore } from '@/store/dashboardHandler'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
const CommentTemp = dynamic(() => import('@/components/CommentTemp'), { ssr: false })
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
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()} 
          className="mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to feed
        </button>

        {/* Post Card */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl">
          {/* Post Image */}
          <div className="relative w-full h-96 sm:h-[500px] bg-gray-700 overflow-hidden">
            <Image 
              src={post?.image || "/pfp.jpg"} 
              alt={post?.title || "Post image"} 
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Content */}
          <div className="p-6">
            {/* Title and Date */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{post?.title || 'Untitled Post'}</h1>
              <div className="text-sm text-gray-400">
                {post?.createdAt ? (
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                ) : 'Date not available'}
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-invert max-w-none mb-6 text-gray-300">
              <p className="whitespace-pre-line">{post?.content || 'No content available.'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                {/* Like Button */}
                {(() => {
                  const userIdStr = session?.user?.id || session?.user?.sub || session?.user?._id;
                  const likes = Array.isArray(post?.likes) ? post.likes : [];
                  const isLiked = !!(userIdStr && likes.some((l) => String(l) === String(userIdStr)));
                  
                  return (
                    <button 
                      onClick={() => { if(session) incrementLike(post?._id, session) }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      }`}
                      aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                    >
                      <FaHeart className={isLiked ? 'fill-current' : ''} />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                  );
                })()}

                {/* Comment Button */}
                <button 
                  onClick={() => {
                    document.querySelector('textarea')?.focus();
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 rounded-lg transition-colors"
                  aria-label="Add a comment"
                >
                  <FaComment />
                  <span>{post?.comments?.length || 0} Comments</span>
                </button>
              </div>

              {/* Share Button */}
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post?.title || 'Check out this post',
                      text: post?.content?.substring(0, 100) + (post?.content?.length > 100 ? '...' : ''),
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:bg-gray-700/50 hover:text-blue-400 rounded-lg transition-colors"
                aria-label="Share this post"
              >
                <FaShare />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Comments {post?.comments?.length ? `(${post.comments.length})` : ''}
          </h2>
          <CommentTemp />
        </div>
      </div>
    </div>
  )
}

export default PostPage