"use client"

import { useSocket } from "./providers/socket-provider"
import {Badge} from '@/components/ui/badge'

export const SocketIndicator=()=>{
    const {isConnected}=useSocket();

    if(!isConnected){
        return (
            <Badge variant="outline" className="bg-yellow-600 p-2 border-none"/>
        )
    }
    return (
        <Badge variant="outline" className="bg-emerald-600 p-2 border-none"/>
    )
}