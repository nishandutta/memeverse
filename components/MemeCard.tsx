'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MemeType } from '@/types/memeTypes'

export default function MemeCard({ meme }: { meme: MemeType }) {
  console.log('meme', meme)
  return (
    <Link href={`/meme/${meme.id}`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className='bg-gray-800 p-4 rounded-xl'
      >
        <Image
          src={meme.url}
          alt={meme.name}
          width={300}
          height={300}
          className='rounded-lg'
        />
        <h2 className='text-lg font-bold mt-2 text-pink-50'>{meme.name}</h2>
      </motion.div>
    </Link>
  )
}
