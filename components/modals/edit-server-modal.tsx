"use client"

import axios from 'axios'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileUplaod } from "../file-uplaod"
import { useForm } from "react-hook-form"
import {Dialog, DialogContent, DialogDescription, DialogTitle , DialogFooter, DialogHeader } from "../ui/dialog"
import { FormControl, Form, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useModal } from '@/hooks/use-modal-store'
import { useEffect } from 'react'

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required"
    })
})


export const EditServerModal = () => {

    const {isOpen,onClose,type,data}=useModal()

    const {server}=data
    const router = useRouter()

    const isModalOpen = isOpen && type ==="editServer"

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })

    useEffect(()=>{
        if(server){
            form.setValue("name", server.name)
            form.setValue("imageUrl", server.imageUrl)
        }
    },[server,form])

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values)
            form.reset()
            router.refresh()
            onClose()

        } catch (err) {
            console.log(err)
        }
    }

    const handleClose=()=>{
        form.reset()
        onClose()
    }

    return (
        <Dialog  open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 rounded-lg overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Provide a name and image to your server ,you can always change this later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUplaod endpoint="serverImage" value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 datk:text-secondary/70">
                                        Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder=" Enter server name" disabled={isLoading} {...field}>

                                        </Input>
                                    </FormControl>
                                </FormItem>
                            )}>

                            </FormField>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" type="submit" disabled={isLoading} className="">
                                Save
                            </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}