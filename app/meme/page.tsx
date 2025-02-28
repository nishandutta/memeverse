'use client'
import { useState, useEffect, useRef, useCallback, SetStateAction } from 'react'
import axios from 'axios'
import MemeCard from '@/components/MemeCard'
import debounce from 'lodash.debounce'
import { MemeType } from '@/types/memeTypes'

export default function MemeExplorer() {
  const [memes, setMemes] = useState<MemeType[]>([])
  const [uploadedMemes, setUploadedMemes] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Trending')
  const [sortBy, setSortBy] = useState('likes')
  const observerRef = useRef(null)

  // Fetch memes with pagination
  const fetchMemes = async () => {
    if (loading) return
    setLoading(true)

    try {
      const res = await axios.get('https://api.imgflip.com/get_memes')
      const newMemes = res.data.data.memes.slice((page - 1) * 10, page * 10)

      setMemes((prev) => [...prev, ...newMemes])
      setPage(page + 1)
    } catch (error) {
      console.error('Error fetching memes:', error)
    }

    setLoading(false)
  }

  // Load uploaded memes from local storage
  useEffect(() => {
    const storedMemes =
      JSON.parse(localStorage.getItem('uploadedMemes') || '[]') || []
    setUploadedMemes(storedMemes)
  }, [])

  // Infinite Scroll Observer
  const observerCallback = useCallback(
    (entries: { isIntersecting: unknown }[]) => {
      if (entries[0].isIntersecting) {
        fetchMemes()
      }
    },
    [loading]
  )

  useEffect(() => {
    if (observerRef.current) {
      const observer = new IntersectionObserver(observerCallback, {
        threshold: 1,
      })
      observer.observe(observerRef.current)
      return () => observer.disconnect()
    }
  }, [observerCallback])

  // Debounced Search Handler
  const handleSearch = debounce(
    (value: SetStateAction<string>) => setQuery(value),
    500
  )

  // Filter & Sort Memes
  const filteredMemes = memes
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'likes'
        ? b.likes - a.likes
        : sortBy === 'date'
        ? parseInt(b.id) - parseInt(a.id)
        : 0
    )

  return (
    <div className='p-0 md:p-6'>
      <h1 className='text-3xl font-bold mb-4'>Meme Explorer</h1>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search memes...'
        className='p-2 w-full mb-4 bg-gray-700 rounded text-white'
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* User Uploaded Memes */}
      <div className='pb-8'>
        <h2 className='text-xl font-bold mt-4'>Your Uploaded Memes</h2>
        {uploadedMemes.length === 0 ? (
          <div className='py-4'>No memes uploaded yet.</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {uploadedMemes.map((meme, index) => (
              <MemeCard key={index} meme={meme} />
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className='mb-4 grid grid-cols-2 md:flex md:space-x-4 gap-2'>
        {['Trending', 'New', 'Classic', 'Random'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded ${
              category === cat ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sorting Options */}
      <div className='mb-4'>
        <label className='mr-2'>Sort by:</label>
        <select
          className='p-2 rounded bg-gray-700'
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value='likes'>Likes</option>
          <option value='date'>Date</option>
          <option value='comments'>Comments</option>
        </select>
      </div>

      {/* Filtered & Sorted Memes */}
      <h2 className='text-xl font-bold mt-4'>{category} Memes</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredMemes.map((meme, index) => (
          <MemeCard key={index} meme={meme} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={observerRef} className='h-10 w-full text-center'>
        {loading && <p>Loading more memes...</p>}
      </div>
    </div>
  )
}
