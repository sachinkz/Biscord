"use client"


import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "../ui/dialog"
import queryString from "query-string"
import { useModal } from '@/hooks/use-modal-store'
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"


export const DeleteMessage = () => {


    const [isLoading,setIsLoading]=useState(false)

    const { isOpen, onClose, type ,data } = useModal()

    const isModalOpen = isOpen && type === "deleteMessage"

    const {apiUrl,query}=data;

    const deleteChannel=async () => {
        try{
            setIsLoading(true)
            const url=queryString.stringifyUrl({
                url:apiUrl || "",
                query
            })
            await axios.delete(url);
            onClose();
            
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
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to permanently Delete the message
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-zinc-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button variant="ghost"  disabled={isLoading} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={deleteChannel} variant="primary">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}