"use client"

import { useEffect, useState } from "react"
import { CreateServerModal } from "@/components/modals/create-server-modal"
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServer } from "@/components/modals/leave-server";
import { DeleteServer } from "@/components/modals/delete-serve-modal";
import { DeleteChannel } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessage } from "@/components/modals/delete-message-modal";

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <CreateServerModal />
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
            <CreateChannelModal/>
            <LeaveServer/>
            <DeleteServer/>
            <DeleteChannel/>
            <EditChannelModal/>
            <MessageFileModal/>
            <DeleteMessage/>
        </>
    )
}