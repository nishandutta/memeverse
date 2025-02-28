'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import MemeCard from '@/components/MemeCard'
import { MemeType } from '@/types/memeTypes'

export default function HomePage() {
  const [trendingMemes, setTrendingMemes] = useState<MemeType[]>([])
  console.log(trendingMemes)

  useEffect(() => {
    axios.get('https://api.imgflip.com/get_memes').then((response) => {
      setTrendingMemes(response.data.data.memes.slice(0, 6))
    })
  }, [])

  return (
    <div className='p-0 md:p-6'>
      <h1 className='text-3xl font-bold mb-4'>Trending Memes</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {trendingMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  )
}
