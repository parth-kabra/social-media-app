import { useEffect, useState } from "react";
import StaticHead from "./statichead";
import God from "../img/test.jpg"
import Image from "next/image";
import { getDatabase, ref, set, get, update, increment} from "firebase/database"
import {app, auth} from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./header";
import Loading from "./loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index(){
	const db = getDatabase();
	const postsRef = ref(db, "posts")
	const [file, setFile] = useState("");
	const [postsData, setPostsData] = useState([])
	const [logged, setLogged] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState("")
	const [userpfp, setPFP] = useState("");

	function getTimeStamp(){
		const now = new Date();
		const year = now.getFullYear(); // Get the current year (4 digits)
		const month = now.getMonth() + 1; // Get the current month (0-11), add 1 to convert to (1-12)
		const day = now.getDate(); // Get the current day (1-31)
		const hours = now.getHours(); // Get the current hour (0-23)
		const minutes = now.getMinutes(); // Get the current minute (0-59)
		const seconds = now.getSeconds(); // Get the current second (0-59)
		
		// Pad single digits with a leading zero
		const formattedMonth = month < 10 ? `0${month}` : month;
		const formattedDay = day < 10 ? `0${day}` : day;
		const formattedHours = hours < 10 ? `0${hours}` : hours;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
		
		// Combine the date and time into a string
		const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
		const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
		const formattedDateTime = `${formattedDate} ${formattedTime}`;

		return formattedDateTime
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
			timeStamp: getTimeStamp()
		}
		document.getElementById("preview").style.display = "none"
		document.getElementById("postbtn").style.display = "none"
		document.getElementById("posttext").value = ""
		const newPost = ref(db, `posts/${randomHash}`)
		set(newPost, post).then(()=>{
			toast.success("Posted successfully")
		}).catch(()=>{
			toast.error("Post failed")
		})
	}

	function likePost(id){
		const updates = {}
		updates[`/${id}/likes`] = increment(1)
		update(postsRef, updates)
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
								<span className="likes">
									<i className='bx bx-heart' onClick={() => likePost(post.key)} id="addlike"></i>
									<p>{post.likes}</p>
								</span>
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