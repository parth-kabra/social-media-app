import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
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

export default async function handler(req, res) {
  	if (req.method === "POST") {
		const { description, banner, likes, creator, pfp, key, email } = req.body

		try {
			const newPost = await prisma.post.create({
				data: {
				description: description,
				banner: banner,
				likes: likes,
				creator: creator,
				pfp: pfp,
				key: key,
				email: email,
				profileLink: `/users/${getUserKey(email)}`
				}
			})
			res.status(201).json(newPost)
		} catch (e) {
			console.log(e)
			res.status(500).json({ error: 'Unable to create post.' })
		}
	} 
	else {
		const posts = await prisma.post.findMany()
		res.status(200).json(posts)
	}
}
