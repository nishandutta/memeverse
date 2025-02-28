'use client'
import '@/app/globals.css'
import { useEffect, useState } from 'react'
import { ReduxProvider } from '@/store/ReduxProvider'
import Navbar from '../components/Navbar'
import { ThemeProvider } from '@/components/context/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(storedTheme)
    document.documentElement.classList.toggle('dark', storedTheme === 'dark')
  }, [])

  return (
    <html lang='en' className={theme}>
      <body className=''>
        <ThemeProvider>
          <ReduxProvider>
            <Navbar />
            <main className='p-4'>{children}</main>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
