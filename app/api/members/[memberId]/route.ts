import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {

    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get('serverId');


        if (!serverId) {
            return new NextResponse("serverId is required", { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse("memberId is required", { status: 400 })
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (err) {
        console.log("[MEMBERS_ID_ERROR]", err)

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {

    try {
        const profile = await currentProfile()
        const {searchParams}=new URL(req.url);
        const serverId = searchParams.get('serverId')

        if (!params.memberId) {
            return new NextResponse("Member id required", { status: 401 })
        }
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            return new NextResponse("Server Id required", { status: 401 })
        }

        const server = await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id,
            },
            data:{
                members:{
                    deleteMany:{
                        id:params.memberId,
                        profileId:{
                            not:profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        
        return NextResponse.json(server)
    } catch (err) {
        console.log("[MEMBER_KICK_ERROR]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}