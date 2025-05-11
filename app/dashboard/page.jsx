'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const [user,setUser] = useState({})
  const User = useSession();

  return (
    <div>
      <div className='flex flex-col'>
        <p>Signed in as:</p>
          <h1>{User.email}</h1>
      </div>
    </div>
  )
}