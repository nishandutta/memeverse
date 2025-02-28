import { configureStore } from '@reduxjs/toolkit'
import memeReducer from './memeSlice'

export const store = configureStore({
  reducer: {
    memes: memeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
