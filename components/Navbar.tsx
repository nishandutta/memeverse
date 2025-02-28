'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HiMenu, HiX } from 'react-icons/hi'
import { BsSun, BsMoon } from 'react-icons/bs' // Icons for light/dark mode
import { useTheme } from './context/ThemeProvider'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className='p-4 bg-gray-800 text-white dark:bg-gray-900'>
      <div className='flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold'>
          MemeVerse
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex space-x-6 items-center'>
          <Link href='/meme' className='hover:text-gray-400'>
            Explore
          </Link>
          <Link href='/meme/upload' className='hover:text-gray-400'>
            Upload
          </Link>
          <Link href='/leaderboard' className='hover:text-gray-400'>
            Leaderboard
          </Link>
          <Link href='/profile' className='hover:text-gray-400'>
            Profile
          </Link>
          {/* Dark Mode Toggle */}
          <button onClick={toggleTheme} className='rounded focus:outline-none '>
            {theme === 'dark' ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden p-2 rounded text-white'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='fixed inset-0 bg-black/90 flex flex-col items-center justify-center space-y-6 text-2xl'>
          <button
            className='absolute top-6 right-6'
            onClick={() => setIsOpen(false)}
          >
            <HiX size={32} />
          </button>
          <Link
            href='/meme'
            className='hover:text-gray-400'
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>
          <Link
            href='/meme/upload'
            className='hover:text-gray-400'
            onClick={() => setIsOpen(false)}
          >
            Upload
          </Link>
          <Link
            href='/leaderboard'
            className='hover:text-gray-400'
            onClick={() => setIsOpen(false)}
          >
            Leaderboard
          </Link>
          <Link
            href='/profile'
            className='hover:text-gray-400'
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          {/* Dark Mode Toggle in Mobile Menu */}
          <button
            onClick={toggleTheme}
            className='p-2 rounded focus:outline-none'
          >
            {theme === 'dark' ? <BsSun size={24} /> : <BsMoon size={24} />}
          </button>
        </div>
      )}
    </nav>
  )
}
