import { PrismaClient } from "@prisma/client";

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

export default async function handler(req, res){
    if(req.method == "POST"){
        const {creator, email, pfp} = req.body
        const response = await prisma.user.findUnique({
            where: {
              email: email,
            },
        })
        if(response){
            res.status(205).json({error:"User already exists."})
        }
        else{
            try{
                const newUser = await prisma.user.create({
                    data:{
                        userKey: getUserKey(email),
                        creator: creator,
                        email: email,
                        pfp: pfp
                    }
                })
                res.status(201).json(newUser)
            }
            catch(e){
                console.log(e)
                res.status(500).json({error : "Failed to set user."})
            }
        }
    }
    else{
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    }
}