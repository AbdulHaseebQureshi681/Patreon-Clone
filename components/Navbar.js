import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
const Navbar = () => {
  return (
    <nav className='bg-gray-800    text-white flex justify-between px-4 h-16 items-center'>
      <Link href="/">
        <div className="logo text-lg flex items-center">Fundora<span><Image src="/alien-21107.gif" alt="logo" width={20} height={20} /></span></div>
      </Link>
      <Link href="/login">
        <button className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' >Login</button>
      </Link>
    </nav>
  )
}

export default Navbar