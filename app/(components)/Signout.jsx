import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import clsx from "clsx";
export default function Signout({isIconOnly}) { 
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
    <button onClick={handleSignOut} className={clsx(
        "w-full flex items-center text-left px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700",
        isIconOnly && "justify-center !px-0"
    )}>
      <LogOut size={18} className={clsx(!isIconOnly && "mr-3")} />
      {!isIconOnly && <span>Sign Out</span>}
    </button>
  );
}