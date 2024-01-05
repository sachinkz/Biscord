"use client"


import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "../ui/dialog"

import { useModal } from '@/hooks/use-modal-store'
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"


export const LeaveServer = () => {

    const router=useRouter()

    const [isLoading,setIsLoading]=useState(false)

    const { isOpen, onClose, type ,data } = useModal()

    const isModalOpen = isOpen && type === "leaveServer"

    const {server}=data;

    const leave=async () => {
        try{
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`);
            onClose();
            router.refresh();
            router.push("/");
        }catch(err){
            console.log(err)
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 rounded-lg overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="text-indigo-500 font-semibold">
                            {server?.name}
                        </span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-zinc-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button variant="ghost"  disabled={isLoading} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={leave} variant="primary">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}