import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Signout() { 
  const router = useRouter();
    const [error,setError] = useState(null);
    const [message,setMessage] = useState(null);
    
  const { data: session } = useSession();
  const handleSignOut = async ()=>{
        if(session){
            return signOut();
        }
        const res = await fetch('/api/signout',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include'
        });
        const data = await res.json();
        if(data.error) return setError(data.error);
        setMessage(data.message);
        router.push('/login')

  }

  return (
    <>
      <button onClick={handleSignOut} className="w-max text-center p-2 rounded-md bg-gray-100 hover:bg-gray-300">Signout</button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

    </>
  );
}