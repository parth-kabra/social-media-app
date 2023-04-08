import StaticHead from "@/components/statichead";
import {app, auth} from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from "next/router";
export default function Login(){
    const provider = new GoogleAuthProvider();
    const router = useRouter()

    function loginUser(){
        signInWithPopup(auth, provider).then(()=>{
            router.push("/")
        }).catch(()=>{})
    }
    return (
        <div className="login">
            <StaticHead/>
            <h1 className="verybig">Join Our Creative <br/>Community.</h1>

            <br/>
            <a className="login__btn" onClick={loginUser}>Login/SignUp with Google</a>
        </div>
    )
}