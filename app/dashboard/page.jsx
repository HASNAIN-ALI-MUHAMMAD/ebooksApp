'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../(componets)/layout'
import Sidebar from '../(componets)/Sidebar'
import clsx from 'clsx'
import Link from 'next/link';
import { Menu } from 'lucide-react'
import Signout from '../(componets)/Signout'
export default function Dashboard() {
  const [user,setUser] = useState({});
  const [mainState,setMainState] = useState('profile')
  const [state,setState] = useState('unclicked')
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(false)
  const [data,setData] = useState([])
  const handleClick = ()=>{
    if(state == "clicked"){
      return setState('unclicked')
    }
    return setState('clicked')
  }


  return (
    <div className='flex'>
      <div className={clsx('flex flex-col float-left h-screen p-2 rounded-md transition',state == "clicked" ? 'w-max' : 'w-1/7')}>
        <div className={clsx('flex flex-col border-1 border-gray-100 w-1/1 rounded-md transition',state == 'clicked' ? ' h-screen':'')}>
          <button onClick={handleClick} className='p-2 w-max text-center'><Menu className='hover:text-gray-700'/></button>
          {
            state == "clicked" && 
            <div className={clsx(state == 'clicked' ? 'flex flex-col gap-10':'')}>
              <Link href={'#'} onClick={()=>setMainState('profile')} className="w-full text-center rounded-md p-1 text-sm bg-gray-100 hover:bg-gray-300">Pr</Link>  
              <Link href={'#'} onClick={()=>setMainState('uploaded')} className="w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300 text-sm">Up</Link>  
              <Link href={'#'} onClick={()=>setMainState('saved')} className="w-full text-center p-1  rounded-md bg-gray-100 hover:bg-gray-300 text-sm">Sv</Link>

            </div>  
          }
        </div>
        <div className={clsx('flex flex-col border-1 border-gray-100 w-1/1 transition h-screen transition gap-10',state == "clicked" ? 'hidden' : 'flex flex-col')}>
          <Link href={'#'} onClick={()=>setMainState('profile')} className="w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300">Profile</Link>  
          <Link href={'#'} onClick={()=>setMainState('uploaded')} className="w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300">Uploaded books</Link>  
          <Link href={'#'} onClick={()=>setMainState('saved')} className="w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300">Saved books</Link>  
              <div>
                <Signout/>
              </div>

        </div>
      </div>
      
      <div className={clsx('flex flex-col border-1 border-gray-200  float-right h-screen',state == "clicked" ? 'w-1/1 transition' : 'w-6/7')}>
            {
              mainState == "profile" && 
              <div className='flex flex-col justify-center items-center h-full'>
              <p>Profile</p>
              </div>
            }
            {
              mainState == "saved" && <p>Saved Books</p>
            }
            {
              mainState == "uploaded" && <p>Uploaded</p>
            }
      </div>
      
    </div>

  )
}