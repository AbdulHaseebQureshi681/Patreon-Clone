"use client"
import React, { useEffect, useState }    from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {FaFacebook, FaInstagram, FaTiktok, FaYoutube} from 'react-icons/fa'
const DynamicUserMain = ({requestedUser}) => {
  const pathname = usePathname()
  const base = `/${requestedUser?.username}`
  const tabs = [
    { label: 'Home', href: base },
    { label: 'Collections', href: `${base}/collections` },
    { label: 'About', href: `${base}/about` },
  ]



  return (<>
   
    <div className="img w-full relative">
      <Image className='object-cover w-full' src={requestedUser?.bannerImage || "/header.png"} alt="banner" width={1200} height={200} />
    <div className="pfp absolute -bottom-14  right-[45.5%] border border-white rounded-2xl">
      <Image className=' rounded-2xl  '  src={requestedUser?.profileImage || "/pfp.jpg"} alt="profile" width={120} height={120} />
    </div>
    </div>
    <div className="text-white flex flex-col gap-2 justify-center items-center my-16">
    <div className=' text-3xl font-bold'>{requestedUser?.username.replaceAll("%20", " ")}</div>
    <div className='text-slate-50' >{requestedUser?.bio}</div>
    <div className='flex items-center gap-2 text-slate-400'>11,007 members<div className='w-1 h-1 rounded-full bg-white'></div>729 Posts</div>
    </div>
    <div className="flex flex-col gap-2 -mt-12 items-center ">
      <button
        className="h-10 w-[100%] max-w-[230px] rounded-lg bg-[#d05a2a] hover:bg-[#e06b39] text-white text-[15px] font-semibold shadow-md transition-colors"
      >
        Join for free
      </button>
      <button
        className="h-10 w-[100%] max-w-[230px] rounded-lg bg-[#3e342f] hover:bg-[#4a3a34] text-[#f3cdb9] text-[15px] font-semibold border border-[#6a5952] shadow-sm transition-colors"
      >
        See Membership Options
      </button>
    </div>
    <div className="socials flex justify-center mt-6 items-center gap-4 text-[#f3cdb9] hover:text-white transition-colors cursor-pointer text-2xl">
      <FaYoutube className="  text-3xl hover:text-red-500"/>
      <FaFacebook className="hover:text-blue-500"/>
      <FaTiktok className="hover:text-pink-500"/>
      <FaInstagram className="hover:text-pink-500"/>
    </div>
    <div className="nav2 border-b-2 border-gray-700">
      <ul className="flex items-center justify-center gap-6 mt-10 text-white">
        {tabs.map(t => {
          const active = pathname === t.href
          return (
            <li key={t.href} className="relative flex flex-col items-center pb-2">
              <Link
              scroll={false}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`text-base font-semibold transition-colors ${active ? 'text-white' : 'text-slate-300 hover:text-white'}`}
              >
                {t.label}
              </Link>
              <span className={`absolute -bottom-[1px] h-[2px] w-10 rounded bg-[#f3cdb9] transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
            </li>
          )
        })}
      </ul>
    </div>
    <div className="h-24 "></div>
  </>
  )
}

export default DynamicUserMain