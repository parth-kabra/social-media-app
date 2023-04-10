import { useEffect, useState } from "react";
import StaticHead from "./statichead";
import God from "../img/test.jpg"
import Image from "next/image";
import {app, auth} from "@/firebase";
import Header from "./header";
import Loading from "./loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index(){
	const [file, setFile] = useState("");
	const [postsData, setPostsData] = useState([])
	const [logged, setLogged] = useState(false);

	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState("")
	const [userpfp, setPFP] = useState("");


	async function handleNewPostPrisma(postDescription){
		const res = await fetch("/api/posts", {
			method: "POST",
			body: JSON.stringify(postDescription),
			headers: {
				'Content-Type': 'application/json',
			}
		})
	}

	function addNewPost(){
		if(!document.getElementById("postbanner") || document.getElementById("posttext").value === ''){
			return;
		}
		const randomBytes = new Uint8Array(16);
		window.crypto.getRandomValues(randomBytes);
		const hashArray = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0'));
		const randomHash = hashArray.join('');
		toast.info("Trying to post...")
		let post = {
			description: document.getElementById("posttext").value,
			banner: file,
			likes: 0,
			creator: user,
			pfp: userpfp,
			key: randomHash,
		}
		handleNewPostPrisma(post);
		document.getElementById("preview").style.display = "none"
		document.getElementById("postbtn").style.display = "none"
		document.getElementById("posttext").value = ""
		
	}

	async function handleLikePostPrisma(postId, postLikes){
		/*const res = await fetch('/api/posts', {
			method: 'PUT',
			body: JSON.stringify({
				postKey: postId,
				newLikes: postLikes + 1
			}),
			headers: {
				'Content-Type': 'application/json',
			}
		})*/
	}

	function likePost(post_data){
		//handleLikePostPrisma(post_data.key, post_data.likes)
	}


	useEffect(()=>{
		function loadUser() {
			return new Promise((resolve, reject) => {
			  auth.onAuthStateChanged((current_user) => {
				if (current_user) {
				  setLogged(true)
				  setUser(current_user.displayName)
				  setPFP(current_user.photoURL)
				  resolve(current_user)
				} else {
				  reject('User not logged in')
				}
			  })
			})
		}

		loadUser().then(()=>{
			setLoading(true);
		}).catch(()=>{
			setLoading(true)
		})

		async function getPostsData() {
			const response = await fetch('/api/posts')
			let posts = await response.json()
			posts.reverse()
			setPostsData(posts)
		}
		getPostsData()

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
			<>
			<Loading />
			<a href="https://github.com/parth-kabra/social-media-app"><i className='bx bxl-github'></i></a>
			</>
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
						
						<div className="userpost" key={post.key}>
							<span className="creator">
								<img src={post.pfp} />
								<p className="normal">{post.creator}</p>
								{post.creator == "parth kabra" ? <i className='bx bxs-crown'></i> : <></>}
							</span>
							<br />
							<span className="description">
								<p>{post.description}</p>
							</span>
							
							<span id="view">
								<img src={post.banner} />
							</span>
							<span className="userposticons">
								<br />
								{/*<span className="likes">
									<i className='bx bx-heart' onClick={() => likePost(post)} id="addlike"></i>
									<p>{post.likes}</p>
								</span>*/}
							</span>
						</div>
					))
					}
				</div>
				<br />

            </section>
			<a href="https://github.com/parth-kabra/social-media-app"><i className='bx bxl-github'></i></a>
			<Header />
        </div>
    )
}