import Loading from "@/components/loading";
import StaticHead from "@/components/statichead";
import { useRouter } from "next/router";
import {app, auth} from "@/firebase";
import { useState } from "react";
import { signOut } from 'firebase/auth';

export default function User({users}){
    const router = useRouter()
    const {user} = router.query
    if(!user ){
        return <Loading />
    }
    const [useremail, setUserEmail] = useState("69")
    function loginUser(){
        auth.onAuthStateChanged((current) => {
            if(current){
                const email = current.email
                setUserEmail(email)
            }
        })
    }

    loginUser()

    const userKey = parseInt(user, 10)
    let res = null;
    for(let i = 0; i < users.length ;i++){
        if(users[i].userKey == userKey){
            res = users[i];
            break;
        }
    }
    let profileEmail = "";
    if(res){
        profileEmail = res.email
    }
    
    function logoutUser(){
        signOut(auth).then(()=>{
            window.location.reload()
        }).catch(()=>{})
    }

    if(res){

        return (
            <>
                <StaticHead />
                <section className="profile">
                    <span className="banner">
                        <img src={res.pfp} />
                    </span>
                    <p className="username">{res.creator} <i className='bx bx-badge-check'></i></p>
                    <p align="center">{res.email}</p>
                    <br />

                    {

                    (useremail == profileEmail) ?
                    <span>
                        <span className="buttons">
                            <span>
                                <a href="/" className="login__btn btn1_1">Start a new post <i className='bx bx-plus'></i></a>
                            </span>
                            <span>
                                <a onClick={logoutUser} className="login__btn btn1">Logout</a>
                            </span>
                        
                        </span>
                        <br/>
                    </span>
                    : <></>
                    }
                    <span className="buttons">
                        <a href="/community" className="login__btn">View community <i class='bx bx-happy-heart-eyes'></i></a>
                    </span>
                </section>
            </>
        )
    }
    
    return (
        <>
            <StaticHead />
            <h1 align="center">It appears that there is no such user</h1>
        </>
    )
}

export async function getServerSideProps(){
    const res = await fetch("http://localhost:3000/api/users");

    const data = await res.json()
    return {
        props :{
            users: data
        }
    }
}
