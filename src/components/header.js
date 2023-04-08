import { app, auth } from "@/firebase";
import { useEffect, useState } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';

export default function Header(){
    const [logged, setLogged] = useState(false);
    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
			if(user){
				setLogged(true)
			}
		})
    })

    function logoutUser(){
        signOut(auth).then(()=>{
            window.location.reload()
        }).catch(()=>{})
    }

    return (
        <header className="header">
            <a className="friendverse" href="/">friendverse</a>
            <span className="options">
                {!logged ? <a href="/login" className="login__btn">Login/Signup</a> : <></>}
                {logged ? <a onClick={logoutUser} className="login__btn headerbtn">Logout</a> : <></>}
            </span>
        </header>
    )
}