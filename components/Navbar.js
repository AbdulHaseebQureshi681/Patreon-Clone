"use client";
import React ,{useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
const Navbar = () => {
  const { data: session } = useSession();
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <nav className="bg-gray-800    text-white flex justify-between px-4 h-16 items-center">
      <Link href="/">
        <div className="logo text-lg flex items-center">
          Fundora
          <span>
            <Image src="/alien-21107.gif" alt="logo" width={20} height={20} />
          </span>
        </div>
      </Link>

      {session ? (
        <div className="relative flex items-center gap-2">
        

          <button
            id="dropdownDefaultButton"
            onClick={() => setShowDropDown(!showDropDown)}
            onBlur={()=>setTimeout(()=>setShowDropDown(false),100)}
            data-dropdown-toggle="dropdown"
            className="ml-2 text-white bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-800"
            type="button"
          >
            Welcome {session.user.name}
            <svg
              className="w-2.5 h-2.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          <div
            id="dropdown"
            className={`${showDropDown?"":"hidden"} absolute right-0 top-full mt-2 z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Your Page
                </Link>
              </li>
            
              <li>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link href="/login">
          <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
