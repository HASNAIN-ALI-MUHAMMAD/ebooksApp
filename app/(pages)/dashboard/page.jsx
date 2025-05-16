'use client'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link';
import { Menu } from 'lucide-react'
import Signout from '../../(componets)/Signout'
import Layout from '../../(componets)/topbar';
import Image from 'next/image';
import { ToastContainer,toast,Zoom } from 'react-toastify';

export default function Dashboard() {
  const [user,setUser] = useState({});
  const [mainState,setMainState] = useState('profile')
  const [state,setState] = useState('unclicked')
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const [userData,setUserData] = useState([]);
  const [books,setBooks] = useState([]);

  const notify = (mess,typ)=>toast(mess,{
          theme:"light",
          transition:Zoom,
          hideProgressBar:true,
          autoClose:3000,
          type:typ
      }
      );

  useEffect(()=>{
    async function getUser(){
      const user = await fetch('/api/userdata',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        },
        credentials:'include'
      }
      ).then(res=>res.json())
      setLoading(false)
      setUserData(user.user)
      console.log(user.user)
    }
    getUser()
},[])

  useEffect(()=>{
    async function getBooks(){
      const res = await fetch('/api/userbooks');
      const data = await res.json();
      if(data.error) return notify(data.error,'error')
      setLoading(false)
      setBooks(data.userBooks)
      console.log(data.userBooks)
    }
    getBooks()
    console.log('books state',books)
  },[mainState])

  const handleClick = ()=>{
    if(state == "clicked"){
      return setState('unclicked')
    }
    return setState('clicked')
  }


  return (
    <div className='flex'>
      <Layout/>
      <ToastContainer/>
      <div className={clsx('flex mt-10 flex-col float-left h-screen p-2 rounded-md transition',state == "clicked" ? 'w-max' : 'w-1/7')}>
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
          <Link href={'#'} onClick={()=>setMainState('profile')} className={clsx("w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300",mainState == 'profile' ? 'bg-gray-300':'')}>Profile</Link>  
          <Link href={'#'} onClick={()=>setMainState('uploaded')} className={clsx("w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300",mainState == 'uploaded' ? 'bg-gray-300':'')}>Uploaded books</Link>  
          <Link href={'#'} onClick={()=>setMainState('saved')}className={clsx("w-full text-center p-1 rounded-md bg-gray-100 hover:bg-gray-300",mainState == 'saved' ? 'bg-gray-300':'')}>Saved books</Link>  
              <div>
                <Signout/>
              </div>

        </div>
      </div>
      
      <div className={clsx('flex flex-col border-1 border-gray-200  mt-12 rounded-md float-right h-screen',state == "clicked" ? 'w-1/1 transition' : 'w-6/7')}>
            {
              mainState == "profile" && 
              <div className='flex flex-col justify-center items-center h-full'>
                <div className='flex flex-col gap-10 w-1/2'>
                      <h2>Profile</h2>
                      <div>
                        {userData?.image ? <Image src={userData?.image} width={50} height={50} alt="user" /> :''}
                        <h1>Email: {userData.email}</h1>
                        <h1>Name: {userData.name}</h1>

                      </div>
                </div>
              </div>
            }
            {
              mainState == "saved" &&
              <div>
                <p>No saved books</p>
              </div>
            }
            {
              mainState == "uploaded" &&
                books.length == 0 ? 
                <div className='flex flex-col justify-center items-center h-full'>
                  <p>You haven't uploaded a book yet.</p>
                  <p>Why not try!</p>
                  <Link href={'/addbooks'} className='bg-gray-300 hover:bg-gray-500 p-2 rounded-lg focus:border-2 focus:border-black'>Upload books</Link>
                </div> : 
                <div className='flex flex-col gap-10'>
                  <ol>
                  {
                    books.map((book,index)=>(
                      <li key={index} className='flex flex-col p-3 gap-5'>
                        <h1 className='text-md'>Title:{book.title}</h1>
                        <h1>Author:{book.author}</h1>
                        <h1>Description:{book.description}</h1>
                      </li>
                    ))
                  }
                  </ol>

                </div>
                }
            
      </div>
      
    </div>

  )
}