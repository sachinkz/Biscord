import { ChatHeader } from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media.room";
import { getOrCreateConvo } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean
    }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {

    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn()
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) {
        return redirect("/")
    }

    const converstion = await getOrCreateConvo(currentMember.id, params.memberId)
    if (!converstion) {
        return redirect(`/servers/${params.serverId}`)
    }
    const { memberOne, memberTwo } = converstion;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
            <ChatHeader name={otherMember.profile.name} imageUrl={otherMember.profile.imageUrl} serverId={params.serverId} type="conversation" />
            {
                searchParams.video &&(
                    <MediaRoom chatId={converstion.id} video={true} audio={true} />
                )
            }
            
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={converstion.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramValue={converstion.id}
                        paramKey="conversationId"
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{ conversationId: converstion.id }} />

                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: converstion.id
                        }} />
                </>
            )}

        </div>
    );
}

export default MemberIdPage;