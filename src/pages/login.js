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
            <br/>
            <a className="cmp__text" href="https://cerulean-ostrich-10d.notion.site/Terms-and-conditions-0c5113a1c87849428a11f63f8a9230a1">By creating an account you agree to Our Terms and Conditions</a>
        </div>
    )
}