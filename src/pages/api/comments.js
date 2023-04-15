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
    if(req.method == "POST"){
        // add new comment to database with key = req.body.key
        try{
            const {pfp, key, creator, text, email} = req.body
            const newPost = await prisma.comment.create({
                data: {
                    pfp: pfp,
                    key: key,
                    creator: creator,
                    text: text,
                    email: email,
                    profileLink: `/users/${getUserKey(email)}`
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