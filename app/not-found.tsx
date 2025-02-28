'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const meme404s = [
  {
    url: 'https://i.imgflip.com/1bij.jpg', // Popular "One does not simply" meme
    text: 'One does not simply find this page...',
  },
  {
    url: 'https://i.imgflip.com/26am.jpg', // "Distracted Boyfriend" meme
    text: "Looking for this page? Nah, it doesn't exist.",
  },
  {
    url: 'https://i.imgflip.com/2hgfw.jpg', // "Waiting Skeleton" meme
    text: 'Still waiting for this page to exist...',
  },
  {
    url: 'https://i.imgflip.com/3vzej.jpg', // "Gru's Plan" meme
    text: 'Step 1: Search for a page. Step 2: Find 404 instead.',
  },
]

export default function NotFoundPage() {
  const router = useRouter()
  const [meme, setMeme] = useState<{ url: string; text: string } | null>(null)

  useEffect(() => {
    // Randomly select a meme from the list
    const randomMeme = meme404s[Math.floor(Math.random() * meme404s.length)]
    setMeme(randomMeme)
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      {meme && (
        <div className='relative w-80 h-80 mb-4'>
          <Image
            src={meme.url}
            alt='404 Meme'
            layout='fill'
            objectFit='contain'
            className='rounded-lg animate-bounce'
          />
        </div>
      )}
      <p className='text-lg mb-6'>{meme?.text}</p>
      <button
        onClick={() => router.push('/')}
        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition'
      >
        🏠 Go Back Home
      </button>
    </div>
  )
}
