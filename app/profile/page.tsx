'use client'
import { MemeType } from '@/types/memeTypes'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Meme Lover',
    bio: 'I love memes!',
    avatar: '/default-avatar.png',
  })

  const [streak, setStreak] = useState(0)

  const [uploadedMemes, setUploadedMemes] = useState<MemeType[]>([])
  const [likedMemes, setLikedMemes] = useState<MemeType[]>([])

  useEffect(() => {
    const storedProfile =
      JSON.parse(localStorage.getItem('userProfile') || '{}') || profile
    setProfile(storedProfile)

    // Load Upload Streak
    const storedStreak =
      parseInt(localStorage.getItem('uploadStreak') || '0') || 0
    setStreak(storedStreak)

    // Load User-Uploaded Memes
    const storedMemes =
      JSON.parse(localStorage.getItem('uploadedMemes') || '[]') || []
    setUploadedMemes(storedMemes)

    // Load Liked Memes
    const storedLikes =
      JSON.parse(localStorage.getItem('likedMemes') || '[]') || []
    setLikedMemes(storedLikes)
  }, [])

  const handleProfileUpdate = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    alert('Profile updated!')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        const newProfile = { ...profile, avatar: reader.result as string }
        setProfile(newProfile)
        localStorage.setItem('userProfile', JSON.stringify(newProfile))
      }
      reader.readAsDataURL(file)
    }
  }

  //pagination for uploaded memes
  const [currentPage, setCurrentPage] = useState(1)
  const memesPerPage = 4
  // Calculate total pages
  const totalPages = Math.ceil(uploadedMemes.length / memesPerPage)
  // Get memes for the current page
  const startIndex = (currentPage - 1) * memesPerPage
  const currentMemes = uploadedMemes.slice(
    startIndex,
    startIndex + memesPerPage
  )

  //pagination for liked memes
  const [currentLikePage, setCurrentLikePage] = useState(1)
  const memesLikedPerPage = 4
  // Calculate total pages
  const totalLikePages = Math.ceil(likedMemes.length / memesLikedPerPage)
  // Get memes for the currentLike page
  const startLikeIndex = (currentLikePage - 1) * memesLikedPerPage
  const currentLikeMemes = likedMemes.slice(
    startLikeIndex,
    startLikeIndex + memesLikedPerPage
  )

  return (
    <div className='p-0 md:p-6'>
      <h1 className='text-3xl font-bold mb-4'>User Profile</h1>

      {/* Avatar & Profile Info */}
      <div className='mb-6 flex items-center space-x-4'>
        <label htmlFor='avatarUpload'>
          <img
            src={profile.avatar}
            alt='Avatar'
            className='w-16 h-16 rounded-full cursor-pointer'
          />
        </label>
        <input
          type='file'
          id='avatarUpload'
          className='hidden'
          accept='image/*'
          onChange={handleAvatarChange}
        />

        <div>
          <input
            type='text'
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className='p-2 border rounded mb-2 w-full'
          />
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className='p-2 border rounded w-full'
          />
          <button
            onClick={handleProfileUpdate}
            className='bg-blue-500 text-white px-4 py-2 mt-2'
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Streak */}
      <div className='mt-2 text-green-500 font-semibold'>
        🔥 Upload Streak: {streak} Days!
      </div>

      {/* Uploaded Memes */}
      <div className='mt-6'>
        <h2 className='text-2xl font-bold mb-3'>📤 Uploaded Memes</h2>
        {uploadedMemes.length === 0 ? (
          <p className='text-gray-400'>No memes uploaded yet.</p>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-center'>
              {currentMemes.map((meme) => (
                <Image
                  width={400}
                  height={400}
                  key={meme.id}
                  src={meme.url}
                  alt={meme.name}
                  className='w-full h-auto rounded'
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className='mt-4 flex justify-center space-x-4'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500'
                }`}
              >
                ← Previous
              </button>
              <span className='px-4 py-2'>{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500'
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Liked Memes */}
      <div className='mt-6'>
        <h2 className='text-2xl font-bold mb-3'>❤️ Liked Memes</h2>
        {likedMemes.length === 0 ? (
          <p className='text-gray-400'>No memes liked yet.</p>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              {currentLikeMemes.map((meme) => (
                <Link href={`/meme/${meme.id}`} key={meme.id}>
                  <Image
                    width={400}
                    height={400}
                    key={meme.id}
                    src={meme.url}
                    alt={meme.name}
                    className='w-full h-full rounded'
                  />
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className='mt-4 flex justify-center space-x-4'>
              <button
                onClick={() =>
                  setCurrentLikePage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentLikePage === 1}
                className={`px-4 py-2 rounded ${
                  currentLikePage === 1
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500'
                }`}
              >
                ← Previous
              </button>
              <span className='px-4 py-2'>{`Page ${currentLikePage} of ${totalLikePages}`}</span>
              <button
                onClick={() =>
                  setCurrentLikePage((prev) =>
                    Math.min(prev + 1, totalLikePages)
                  )
                }
                disabled={currentLikePage === totalLikePages}
                className={`px-4 py-2 rounded ${
                  currentLikePage === totalLikePages
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500'
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
