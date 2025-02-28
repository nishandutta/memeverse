import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Meme {
  id: string
  url: string
  caption: string
  likes: number
}

interface MemeState {
  memes: Meme[]
}

const initialState: MemeState = {
  memes: [],
}

const memeSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    setMemes: (state, action: PayloadAction<Meme[]>) => {
      state.memes = action.payload
    },
    likeMeme: (state, action: PayloadAction<string>) => {
      const meme = state.memes.find((m) => m.id === action.payload)
      if (meme) meme.likes += 1
    },
  },
})

export const { setMemes, likeMeme } = memeSlice.actions
export default memeSlice.reducer
