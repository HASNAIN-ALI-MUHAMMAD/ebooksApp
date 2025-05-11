'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../(componets)/layout'
import Sidebar from '../(componets)/Sidebar'

export default function Dashboard() {
  const [user,setUser] = useState({})

  return (
    <div>
      <Layout/>
      <p>Profile: </p>
    </div>

  )
}