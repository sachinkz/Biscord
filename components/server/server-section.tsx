"use client"

import { ChannelType, Member, MemberRole, Profile, Server } from "@prisma/client"
import { ActionTooltip } from "../action-tooltip"
import { Plus, Settings } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"

interface ServerSecProps {
    label: string
    role?: MemberRole
    sectionType: "channel" | "member"
    channelType?: ChannelType
    server?: Server & {
        members: (Member & { profile: Profile })[];
    }

}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSecProps) => {


    const {onOpen}=useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType ==="channel" &&(
                <ActionTooltip label="create channel" side="top">
                    <button onClick={()=>onOpen("createChannel",{channelType})} className="text-zinc-500 hover:tex-zinc-600 dark:text-zinc-300 transition">
                        <Plus className="h-4 w-4"/>
                    </button>
                </ActionTooltip>
            )}
            {role===MemberRole.ADMIN && sectionType ==="member" &&(
                <ActionTooltip label="Manage members" side="top">
                <button onClick={()=>onOpen("members",{server})} className="text-zinc-500 hover:tex-zinc-600 dark:text-zinc-300 transition">
                    <Settings className="h-4 w-4"/>
                </button>
            </ActionTooltip>
            )}
        </div>
    )
}