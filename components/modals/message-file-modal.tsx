"use client"


import axios from 'axios'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileUplaod } from "../file-uplaod"
import { useForm } from "react-hook-form"
import {Dialog, DialogContent, DialogDescription, DialogTitle , DialogFooter, DialogHeader } from "../ui/dialog"
import { FormControl, Form, FormField, FormItem} from "../ui/form"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import queryString from 'query-string'

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment required"
    })
})

export const MessageFileModal = () => {
    
    const {isOpen,onClose,type,data}=useModal();

    const {apiUrl,query}=data
    const router = useRouter()

    const isModalOpen=isOpen && type ==="messageFile"

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })

    const handleClose=()=>{
        form.reset()
        onClose()
    }
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url=queryString.stringifyUrl({
                url:apiUrl || "",
                query,
            })
            await axios.post(url, {...values,content:values.fileUrl})
            form.reset()
            router.refresh()
            handleClose()

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 rounded-lg overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        send files as message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="fileUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUplaod endpoint="messageFile" value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" type="submit" disabled={isLoading} className="">
                                Send
                            </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}