import { app, auth } from "@/firebase";
import { useEffect, useState } from "react";

export default function Header(){
    const [logged, setLogged] = useState(false);
    const [userpfp, setuserPfp] = useState("");
    const [email, setUseremail] = useState("");
    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
			if(user){
				setLogged(true)
                setUseremail(user.email)
                setuserPfp(user.photoURL)
			}
            else{
            }
		})
    })

    function getUserKey(email){
        let hash = 0;
        if(!email.length){
            return 69;
        }
        for(let i = 0; i < email.length ;i++){
            const ch = email.charCodeAt(i)
            hash = ((hash << 5) - hash) + ch 
            hash = hash & hash
        }
        hash = Math.abs(hash)
        return hash
    }

    return (
        <header className="header">
            <a className="friendverse" href="/">friendverse</a>
            <span className="options">
                {!logged ? <a href="/login" className="login__btn">Login/Signup</a> : <></>}
                {logged ? <a href={`/users/${getUserKey(email)}`}>
                    <img className="userpfp" src={userpfp}/>
                </a> : <></>}
            </span>
        </header>
    )
}