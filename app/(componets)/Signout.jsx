import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Signout() { 
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
  }

  return (
    <>
      <button onClick={handleSignOut}>Signout</button>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

    </>
  );
}