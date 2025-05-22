'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import Confirm from './confirm'

export default function UserProfile({ userData }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(userData?.name || '')
  const [savedName, setSavedName] = useState(userData?.name || '')
  const [hover, setHover] = useState(false)
  

  const handleSave = () => {
    setSavedName(name)
    setEditing(false)
  }

  return (
    <div className="w-full h-full px-6 py-8 flex flex-col bg-white">
      <div className="flex items-center gap-6 border-b pb-6">
        <div className="relative w-24 h-24">
          <Image
            src={userData?.image || '/default-avatar.png'}
            alt="User Avatar"
            layout="fill"
            className="rounded-full object-cover border border-gray-300"
          />
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-semibold text-gray-800 border-b border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSave}
                className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-800">{savedName}</h2>
              {hover && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Pencil size={18} />
                </button>
              )}
            </div>
          )}
          <p className="text-gray-500">{userData?.email}</p>
        </div>
      </div>
    </div>
  )
}
