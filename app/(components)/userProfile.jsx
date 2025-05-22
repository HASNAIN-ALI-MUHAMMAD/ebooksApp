'use client'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import Signout from '../../(components)/Signout'
import Layout from '../../(components)/topbar'
import { ToastContainer, toast, Zoom } from 'react-toastify'
import UserProfile from '@/app/(components)/dashProfile'
import Uploads from '@/app/(components)/dashUploads'

const ayahs = [
  { text: 'Indeed, with hardship [will be] ease.', source: 'Surah Ash-Sharh 94:6' },
  { text: 'So remember Me; I will remember you.', source: 'Surah Al-Baqarah 2:152' },
  { text: 'And He found you lost and guided [you].', source: 'Surah Ad-Duhaa 93:7' },
  { text: 'Verily, in the remembrance of Allah do hearts find rest.', source: 'Surah Ar-Ra’d 13:28' },
]

export default function Dashboard() {
  const [userData, setUserData] = useState({})
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState('unclicked')
  const [mainState, setMainState] = useState('')
  const [randomAyah, setRandomAyah] = useState(ayahs[Math.floor(Math.random() * ayahs.length)])

  const notify = (mess, typ) =>
    toast(mess, {
      theme: 'light',
      transition: Zoom,
      hideProgressBar: true,
      autoClose: 3000,
      type: typ,
    })

  useEffect(() => {
    setMainState(localStorage.getItem('state') || 'profile')
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('/api/userdata', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'force-cache',
      })
      const data = await res.json()
      setUserData(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getBooks = async () => {
      const res = await fetch('/api/userbooks', {
        method: 'GET',
        next: { revalidate: 60 },
      })
      const data = await res.json()
      if (data.error) return notify(data.error, 'error')
      setBooks(data.allBooks)
    }
    if (mainState === 'uploaded') getBooks()
  }, [mainState])

  const handleClick = () => setState((prev) => (prev === 'clicked' ? 'unclicked' : 'clicked'))

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Layout />
      <ToastContainer />

      <div
        className={clsx(
          'flex flex-col p-2 transition-all duration-300 border-r border-gray-200',
          state === 'clicked' ? 'w-20' : 'w-1/5'
        )}
      >
        <div className="flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <button onClick={handleClick} className="p-2 text-center">
            <Menu className="hover:text-gray-700" />
          </button>

          {state === 'clicked' && randomAyah && (
            <div className="flex flex-col items-center mt-4 space-y-1">
              {randomAyah.text.split(' ').map((word, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-[12px] md:text-sm font-semibold text-black w-full text-center transition-colors duration-300 hover:text-gray-500 break-words py-1"
                >
                  {word}
                </span>
              ))}
              <span className="mt-3 text-[8px] sm:text-[10px] text-gray-400 rotate-90 whitespace-nowrap">
                {randomAyah.source}
              </span>
            </div>
          )}

          {state !== 'clicked' && (
            <div className="flex flex-col gap-4 mt-4">
              <Link
                href="#"
                onClick={() => {
                  setMainState('profile')
                  localStorage.setItem('state', 'profile')
                }}
                className={clsx(
                  'text-center p-2 bg-gray-100 hover:bg-gray-300 rounded',
                  mainState === 'profile' && 'bg-gray-300'
                )}
              >
                Profile
              </Link>
              <Link
                href="#"
                onClick={() => {
                  setMainState('uploaded')
                  localStorage.setItem('state', 'uploaded')
                }}
                className={clsx(
                  'text-center p-2 bg-gray-100 hover:bg-gray-300 rounded',
                  mainState === 'uploaded' && 'bg-gray-300'
                )}
              >
                Uploaded books
              </Link>
              <Link
                href="#"
                onClick={() => {
                  setMainState('saved')
                  localStorage.setItem('state', 'saved')
                }}
                className={clsx(
                  'text-center p-2 bg-gray-100 hover:bg-gray-300 rounded',
                  mainState === 'saved' && 'bg-gray-300'
                )}
              >
                Saved books
              </Link>
              <div className="mt-auto">
                <Signout />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          'flex-1 p-4 transition-all duration-300',
          state === 'clicked' ? 'w-full' : 'w-4/5'
        )}
      >
        {mainState === 'profile' && (
          <div className="w-full">
            {userData && userData.email ? <UserProfile userData={userData} /> : 'Loading...'}
          </div>
        )}
        {mainState === 'saved' && (
          <div>
            <p>No saved books</p>
          </div>
        )}
        {mainState === 'uploaded' && <Uploads />}
      </div>
    </div>
  )
}
