'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function MemeUpload() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [aiCaption, setAiCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  // Handle Image Upload with Format Validation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, and GIF formats are allowed.')
      return
    }

    setImageFile(file)
    setImage(URL.createObjectURL(file)) // Preview image
  }

  // Generate AI Caption
  const generateAICaption = async () => {
    try {
      const res = await axios.get('https://api.imgflip.com/get_memes')
      setAiCaption(res.data.data.memes[Math.floor(Math.random() * 10)].name)
    } catch (error) {
      console.error('AI caption fetch error:', error)
      alert('Failed to generate AI caption.')
    }
  }

  // Handle Meme Submission
  const handleSubmit = async () => {
    if (!imageFile) {
      alert('Please upload an image first!')
      return
    }

    setUploading(true)
    const reader = new FileReader()

    reader.readAsDataURL(imageFile)
    reader.onload = async () => {
      const base64Image =
        typeof reader.result === 'string' ? reader.result.split(',')[1] : ''

      try {
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_MEME_API_KEY}`,
          new URLSearchParams({ image: base64Image }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        const uploadedMeme = {
          id: Date.now(),
          name: caption || aiCaption || 'Custom Meme',
          url: res.data.data.url,
          likes: 0,
          uploader: localStorage.getItem('userName') || 'Anonymous',
        }

        // Save Uploaded Meme to LocalStorage
        const storedMemes =
          JSON.parse(localStorage.getItem('uploadedMemes') || '[]') || []
        localStorage.setItem(
          'uploadedMemes',
          JSON.stringify([...storedMemes, uploadedMeme])
        )

        // ✅ TRACK DAILY STREAKS
        const today = new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        const lastUpload = localStorage.getItem('lastUploadDate')
        let streak = parseInt(localStorage.getItem('uploadStreak') || '0') || 0

        if (lastUpload === today) {
          // Already uploaded today → Keep streak unchanged
        } else if (
          lastUpload &&
          new Date(today).getTime() - new Date(lastUpload).getTime() ===
            86400000
        ) {
          // Uploaded yesterday → Increase streak
          streak++
        } else {
          // Reset streak if more than 1 day gap
          streak = 1
        }

        localStorage.setItem('uploadStreak', streak.toString())
        localStorage.setItem('lastUploadDate', today)

        alert('Meme Uploaded Successfully!')
        router.push('/meme') // Redirect to Meme Explorer
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload meme. Please try again.')
      }

      setUploading(false)
    }
  }

  return (
    <div className='p-0 md:p-6'>
      <h1 className='text-3xl font-bold mb-4'>Upload a Meme</h1>

      {/* File Input with Format Restriction */}
      <input
        type='file'
        accept='image/jpeg, image/png, image/gif'
        onChange={handleImageUpload}
        className='mb-4'
      />
      {image && (
        <img
          src={image}
          alt='Meme preview'
          className='w-64 mb-4 rounded-lg border'
        />
      )}

      <input
        type='text'
        placeholder='Add a caption...'
        className='p-2 w-full bg-gray-700 rounded mb-4 text-white'
        value={aiCaption || caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button
        onClick={generateAICaption}
        className='bg-blue-600 p-2 rounded mb-4 mr-4'
      >
        Generate AI Caption
      </button>
      {/* {aiCaption && <p>AI Caption: {aiCaption}</p>} */}

      <button
        onClick={handleSubmit}
        className='bg-green-600 p-2 rounded'
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Meme'}
      </button>
    </div>
  )
}
