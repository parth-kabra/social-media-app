import { useEffect, useState } from "react";
import StaticHead from "./statichead";
import God from "../img/test.jpg"
import Image from "next/image";
import { getDatabase, ref, set, get, child, remove} from "firebase/database"
import {app, auth} from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./header";
import Loading from "./loading";

export default function Index(){
	const db = getDatabase();
	const postsRef = ref(db, "posts")
	const [file, setFile] = useState("");
	const [postsData, setPostsData] = useState([])
	const [logged, setLogged] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState("")
	const [userpfp, setPFP] = useState("");

	function addNewPost(){
		if(!document.getElementById("postbanner") || document.getElementById("posttext").value === ''){
			return;
		}
		const randomBytes = new Uint8Array(16);
		window.crypto.getRandomValues(randomBytes);
		const hashArray = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0'));
		const randomHash = hashArray.join('');

		let post = {
			description: document.getElementById("posttext").value,
			banner: file,
			likes: 0,
			creator: user,
			pfp: userpfp,
			key: randomHash
		}
		document.getElementById("preview").style.display = "none"
		document.getElementById("postbtn").style.display = "none"
		document.getElementById("posttext").value = ""
		const newPost = ref(db, `posts/${randomHash}`)
		set(newPost, post).then(()=>{
			alert("post added")
		}).catch(()=>{
			alert("failed")
		})
	}

	useEffect(()=>{

		auth.onAuthStateChanged((current_user)=>{
			if(current_user){
				setLogged(true)
				setUser(current_user.displayName)
				setPFP(current_user.photoURL)
			}
		})

		get(postsRef).then((snapshots) =>{
			if(snapshots.exists()){
				const data = snapshots.val();
				let dataArray = Object.values(data)
				dataArray.reverse()
				setLoading(true);
				setPostsData(dataArray)
			}
		}).then(()=>{
			setLoading(true);
		}).catch((error)=>{
			console.log(error)
		})

		const fileInput = document.getElementById('fileinput');
        const preview = document.getElementById('preview');
		if(!fileInput){
			return
		}

        fileInput.addEventListener('change', () => {
			const file = fileInput.files[0];

			if(!file){
				document.getElementById("postbtn").style.display = "none";
				document.getElementById("preview").innerHTML = ""
                return
            }
			else{
				document.getElementById("postbtn").style.display = "inline-block";
			}
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = ()=>{
				setFile(reader.result)
			}

			const fileType = file.type;
        
			if (fileType.startsWith('image/')) {
				const img = document.createElement('img');
				img.src = URL.createObjectURL(file);
				img.id = "postbanner"
				preview.innerHTML = '';
				preview.appendChild(img);
			}
        });

    })
	if(!loading){
		return(
			<Loading />
		)
	}
    return (

        <div className="startpost">
            <StaticHead />

            <section className="home">

                <div className="start">
                    {logged ? 
						<span>
							<p className="big">Start post</p>
							<textarea maxLength={1500} className="textarea" id="posttext" placeholder="Enter some text..."></textarea>

							<p className="normal">Select an image or a video</p>
							<input id="fileinput" type="file" accept=".jpg,.jpeg,.png,.gif" />
							
							<div id="preview"></div>

							<a className="post" onClick={addNewPost} id="postbtn">Post</a>
						</span>
					:
					<span className="login__comp">
						<p className="big"><a href="/login" className="cmp__text">Login/SignUp</a> to post </p>
					</span>
				}
                </div>

				<div className="posts" id="posts">
					{postsData.map((post) => (
						
						<div className="userpost" key={post.banner[10] + post.banner[20] + post.banner[12]}>
							<span className="creator">
								<img src={post.pfp} />
								<p className="normal">{post.creator}</p>
							</span>
							<br />
							<span className="description">
								<p>{post.description}</p>
							</span>
							
							<span id="view">
								<Image src={post.banner} alt="post banner" width={"100"} height={"100"}/>
							</span>
							<span className="userposticons">
								<br />
								<i className='bx bx-heart'></i>
								<i className='bx bx-message-alt'></i>
							</span>
						</div>
					))
					}
				</div>
				<br />

            </section>
			<Header />
        </div>
    )
}