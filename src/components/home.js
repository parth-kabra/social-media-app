import { useEffect, useState } from "react";
import StaticHead from "./statichead";
import God from "../img/test.jpg"
import Image from "next/image";
import {app, auth} from "@/firebase";
import Header from "./header";
import Loading from "./loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Collapse from 'react-collapse';

export default function Index(){
	const [file, setFile] = useState("");
	
	const [postsData, setPostsData] = useState([])
	const [comments, setPostComments] = useState([])

	const [logged, setLogged] = useState(false);
	const [isOpen, setIsOpen] = useState({});
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState("")
	const [userpfp, setPFP] = useState("");
	const [useremail, setUserEmail] = useState("")


	async function handleNewPostPrisma(postDescription){
		const res = await fetch("/api/posts", {
			method: "POST",
			body: JSON.stringify(postDescription),
			headers: {
				'Content-Type': 'application/json',
			}
		})
	}

	function handleCommentCollapse(id){
		setIsOpen((prevState) => ({
			...prevState,
			[id]:!prevState[id]
		}))
	}

	function addNewPost(){
		if(!document.getElementById("postbanner") || document.getElementById("posttext").value === ''){
			return;
		}
		const randomBytes = new Uint8Array(16);
		window.crypto.getRandomValues(randomBytes);
		const hashArray = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0'));
		const randomHash = hashArray.join('');
		toast.info("Trying to post ⌛")
		let post = {
			description: document.getElementById("posttext").value,
			banner: file,
			likes: 0,
			creator: user,
			pfp: userpfp,
			email: useremail,
			key: randomHash,
		}
		handleNewPostPrisma(post)
		toast.success("Posted successfully 🎉🎉")
		document.getElementById("preview").style.display = "none"
		document.getElementById("postbtn").style.display = "none"
		document.getElementById("posttext").value = ""
		
	}

	async function handleLikePostPrisma(post_data){
		const res = await fetch('/api/post_data', {
			method: 'POST',
			body: JSON.stringify(post_data),
			headers: {
				'Content-Type': 'application/json',
			}
		})
	}

	async function handlePostComment(comment_data){
		const res = await fetch("/api/comments", {
			method: "POST",
			body: JSON.stringify(comment_data),
			headers: {
				"Content-Type": "application/json"
			}
		})
	}

	function PostComment(postkey){
		// get the values
		let text = document.getElementById("post__comment").value
		while(text.length && text[text.length - 1] == ' '){
			delete text[text.length - 1]
		}
		if(!text.length){
			toast.warning("Comment can not be empty.")
			return
		}
		document.getElementById("post__comment").value = ""
		const comment = {
			pfp: userpfp,
			key: postkey,
			creator: user,
			text: text,
			email: useremail
		}
		handlePostComment(comment)

	}

	function likePost(post_data){
		handleLikePostPrisma(post_data)
	}


	useEffect(()=>{
		function loadUser() {
			return new Promise((resolve, reject) => {
			  auth.onAuthStateChanged((current_user) => {
					if (current_user) {
						setLogged(true)
						setUser(current_user.displayName)
						setPFP(current_user.photoURL)
						setUserEmail(current_user.email)
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
		async function getPostComments(){
			const response = await fetch("/api/comments")
			const comments = await response.json()
			setPostComments(comments)
		}

		getPostsData()
		getPostComments()

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
				console.log(img.src)
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
							<p className="big">Start a new post</p>
							<textarea maxLength={1500} className="textarea" id="posttext" placeholder="Enter some text..."></textarea>

							<p className="normal">Select a banner for post</p>
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
						<span>
							<div className="userpost" key={post.key}>
								<span className="creator">
									<img src={post.pfp} />
									<a href={post.profileLink} className="normal">{post.creator}</a>
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
									<span className="likes">
										{
											logged ?
											<i className='bx bx-heart' onClick={() => likePost(post)} id="addlike"></i>
											:
											<i className='bx bx-heart' onClick={() => toast.error("Login to like the post.")}></i>
										}
										<p>{post.likes}</p>
									</span>
									<i className='bx bx-message' onClick={()=> handleCommentCollapse(post.key)}></i>
									
								</span>
							</div>
							<Collapse isOpened={isOpen[post.key]}>
								{
									logged ?
									<span className="comments">
										<span className="comment addcomment">
											<input type="text" id="post__comment" className="post__input" maxLength={200} placeholder="Add a comment" />
											<i className='bx bxs-send post__comment' onClick={()=> PostComment(post.key)} ></i>
										</span>
									</span>
									:
									<span className="comments">
										<span className="login__comp">
											<p className="big"><a href="/login" className="cmp__text">Login/SignUp</a> to comment </p>
										</span>
									</span>
			
								}
								<span className="comments">
								{comments.map((comment_data) => (
									<span className="comment" key = {comment_data.key} style={comment_data.key != post.key ? {display:"none"} : {}}>
										<span className="creator">
											<img src={comment_data.pfp} />
											<a href={post.profileLink} className="normal">{comment_data.creator}</a>
											{comment_data.creator == "parth kabra" ? <i className='bx bxs-crown'></i> : <></>}
										</span>
										<br />
										<span className="description">
											<p>{comment_data.text}</p>
										</span>
									</span>
								))}
								</span>
							</Collapse>
						</span>						
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