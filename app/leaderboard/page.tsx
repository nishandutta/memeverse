'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<
    { username: string; engagement: number }[]
  >([])
  const [topMemes, setTopMemes] = useState<
    { url: string; name: string; likes: number }[]
  >([])

  useEffect(() => {
    const storedMemes =
      JSON.parse(localStorage.getItem('uploadedMemes') || '[]') || []

    // 🏆 Rank users based on total engagement (likes + comments)
    const userEngagement: { [key: string]: number } = {}
    storedMemes.forEach(
      (meme: {
        uploader: string
        likes: unknown
        comments: string | unknown[]
      }) => {
        const user = meme.uploader || 'Anonymous'
        const totalEngagement =
          (Number(meme.likes) || 0) + (meme.comments?.length || 0)

        if (!userEngagement[user]) userEngagement[user] = 0
        userEngagement[user] += totalEngagement
      }
    )

    // 🏅 Sort users by engagement (likes + comments)
    const rankedUsers = Object.entries(userEngagement)
      .map(([username, engagement]) => ({ username, engagement }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10) // Top 10 users

    setLeaderboard(rankedUsers)

    // 🎖️ Top 10 Most Liked Memes
    const sortedMemes = [...storedMemes]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10)
    setTopMemes(sortedMemes)
  }, [])

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>🏆 Leaderboard</h1>

      {/* 🏅 User Rankings */}
      <h2 className='text-2xl font-bold mb-4'>Top Users</h2>
      <ul className='space-y-3'>
        {leaderboard.map((user, index) => (
          <li
            key={index}
            className='text-pink-50 flex justify-between p-3 bg-gray-700 rounded text-lg'
          >
            <span>
              {index + 1 === 1
                ? '🥇'
                : index + 1 === 2
                ? '🥈'
                : index + 1 === 3
                ? '🥉'
                : '🎖️'}{' '}
              {user.username}
            </span>
            <span>{user.engagement} Engagement</span>
          </li>
        ))}
      </ul>

      {/* 🔥 Top 10 Most Liked Memes */}
      <h2 className='text-2xl font-bold mt-8 mb-4'>🔥 Most Liked Memes</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {topMemes.map((meme, index) => (
          <div key={index} className='bg-gray-800 p-3 rounded'>
            <Image
              height={200}
              width={400}
              src={meme.url}
              alt={meme.name}
              className='w-full rounded'
            />
            <p className='mt-2 text-center text-pink-50'>{meme.name}</p>
            <p className='text-center text-sm text-gray-400'>
              ❤️ {meme.likes} Likes
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
