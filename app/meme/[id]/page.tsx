'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ParamValue } from 'next/dist/server/request/params'
import { MemeType } from '@/types/memeTypes'

export default function MemeDetails() {
  const { id } = useParams()
  const [meme, setMeme] = useState<MemeType>()
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  console.log('meme', meme)

  useEffect(() => {
    const fetchMeme = async () => {
      const res = await fetch('https://api.imgflip.com/get_memes')
      const memes = await res.json()
      console.log('new memes', memes)

      let memeData
      memeData = memes.data.memes.find((m: { id: ParamValue }) => m.id === id)
      console.log('meme status', meme)
      if (!meme) {
        const localMeme = localStorage.getItem('uploadedMemes') as string
        const parsedMemes = JSON.parse(localMeme)
        console.log('localmeme', parsedMemes)
        memeData = parsedMemes.find(
          (meme: { id: unknown }) => String(meme.id) === String(id)
        )
        console.log('memedata', memeData)
      }
      setMeme(memeData)

      // Load likes & comments from localStorage
      const storedLikes =
        parseInt(localStorage.getItem(`likes-${id}`) || '0') || 0
      setLikes(storedLikes)
      setLiked(storedLikes > 0)
      const storedComments = localStorage.getItem(`comments-${id}`)
      setComments(storedComments ? JSON.parse(storedComments) : [])
    }

    fetchMeme()
  }, [id])

  const handleLike = () => {
    const newLikes = liked ? likes - 1 : likes + 1
    setLikes(newLikes)
    setLiked(!liked)
    localStorage.setItem(`likes-${id}`, newLikes.toString())

    // ✅ Save liked meme to localStorage
    let likedMemes: { id: string; url: string; name: string }[] =
      JSON.parse(localStorage.getItem('likedMemes') || '[]') || []
    if (!liked) {
      if (meme && !likedMemes.some((m: { id: unknown }) => m.id === meme.id)) {
        likedMemes.push({ id: meme.id, url: meme.url, name: meme.name })
        localStorage.setItem('likedMemes', JSON.stringify(likedMemes))
      }
    } else {
      likedMemes = likedMemes.filter((m) => meme && m.id !== meme.id)
      localStorage.setItem('likedMemes', JSON.stringify(likedMemes))
    }
  }

  const handleComment = () => {
    if (!newComment.trim()) return
    const updatedComments = [...comments, newComment]
    setComments(updatedComments)
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments))
    setNewComment('')
  }

  if (!meme) return <p>Loading...</p>

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>{meme.name}</h1>
      <Image
        src={meme.url}
        alt={meme.name}
        width={500}
        height={500}
        className='rounded-lg mb-4'
      />

      {/* Animated Like Button */}
      <motion.button
        onClick={handleLike}
        className={`p-2 rounded mb-4 flex items-center space-x-2 ${
          liked ? 'bg-red-600' : 'bg-gray-700'
        }`}
        whileTap={{ scale: 0.8 }}
        animate={{ scale: liked ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        ❤️ {likes}
      </motion.button>

      <h2 className='text-xl font-bold'>Comments</h2>
      <input
        type='text'
        placeholder='Add a comment...'
        className='p-2 w-full bg-gray-700 rounded mb-4'
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={handleComment} className='bg-blue-600 p-2 rounded'>
        Comment
      </button>

      <ul className='mt-4'>
        {comments.map((c, i) => (
          <li key={i} className='bg-gray-800 p-2 mb-2 rounded'>
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}
