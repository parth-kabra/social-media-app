import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  	if (req.method === "POST") {
		//const { description, banner, likes, creator, pfp, key } = req.body
        const post_data = req.body;
        try {
            const likePost =  await prisma.post.update({
                where: {
                    id: post_data.id
                },
                data: {
                    likes: { increment: 1 }
                }
            })
            res.status(301).json(likePost)
		} catch (e) {
            console.log(e)
			res.status(500).json({ error: 'Unable to like the post.' })
		}
	} 
}
