import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if(req.method == "POST"){
        // add new comment to database with key = req.body.key
        try{
            const {pfp, key, creator, text} = req.body
            const newPost = await prisma.comment.create({
                data: {
                    pfp: pfp,
                    key: key,
                    creator: creator,
                    text: text
                }
            })
            res.status(201).json(newPost)
        }
        catch(e){
            console.log(e)
            res.status(599).json({ error: 'Unable to create comment.' })
        }
    }
    else{
        const comments = await prisma.comment.findMany()
		res.status(200).json(comments)
    }
}