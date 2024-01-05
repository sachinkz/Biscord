"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

interface ActionTooltip {
    label:string
    children:React.ReactNode
    side?:"top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
}


export const ActionTooltip = ({label, children, side, align}:ActionTooltip) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className="bg-white  dark:bg-zinc-600  dark:text-white text-zinc-800 px-[4px] rounded">
                    {label.toLowerCase()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}