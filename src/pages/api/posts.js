import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  	if (req.method === "POST") {
		const { description, banner, likes, creator, pfp, key } = req.body

		try {
			const newPost = await prisma.post.create({
				data: {
				description: description,
				banner: banner,
				likes: likes,
				creator: creator,
				pfp: pfp,
				key: key,
				}
			})
			res.status(201).json(newPost)
		} catch (e) {
			res.status(500).json({ error: 'Unable to create post.' })
		}
	} 
	else {
		const posts = await prisma.post.findMany()
		res.status(200).json(posts)
	}
}
