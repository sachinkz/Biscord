import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function POST(req: Request){
    try{
        const {name,type}=await req.json()
        const {searchParams}=new URL(req.url)
        const profile=await currentProfile()
        const serverId=searchParams.get('serverId');

        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        
        if(!serverId){
            return new NextResponse("Server Id required",{status:400})
        }
        
        if(name==="general"){
            return new NextResponse("Name cannot be 'general'",{status:400})
        }

        const server =await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    create:{
                        profileId:profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(server)
        
    }catch(err){
        console.log("[CHANNEL_POST]",err)
        return new NextResponse("Internal server error",{status:500});
    }
}