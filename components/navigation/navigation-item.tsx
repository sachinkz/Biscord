"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ActionTooltip } from "../action-tooltip"

interface NavigationItemsProps {
    name: string
    id: string
    imageUrl: string
}

export const NavigationItem = ({ name, id, imageUrl }: NavigationItemsProps) => {

    
    const router = useRouter();
    const params = useParams();
    
    const handleClick = () => {
        router.push(`/servers/${id}`)
    }

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={handleClick} className="group flex relative items-center mt-3">
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]")} 
                    />

                <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image src={imageUrl} alt="channel" fill className="object-cover" />
                </div>
            </button>
        </ActionTooltip>
    )
}