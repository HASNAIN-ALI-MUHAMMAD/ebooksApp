'use client'
import Confirm from "@/app/(components)/confirm"

export default function Check(){
    return(
        <div>
            <p>Checking...</p>
            <Confirm text={'Hey there would you like to visit our webpage? :)'} setResponse={(res)=>{
                console.log(res)
            }}/>
        </div>
    )
}