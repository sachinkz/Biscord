"use client"

import axios from 'axios'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Dialog, DialogContent, DialogTitle , DialogFooter, DialogHeader } from "../ui/dialog"
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select,SelectContent,SelectTrigger,SelectValue,SelectItem } from '../ui/select'
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useParams, useRouter } from "next/navigation"
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import queryString from 'query-string'
import { useEffect } from 'react'

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required"
    }).refine(name=> name !== "general",{message:"channel name cannot be 'general'"}),
    type:z.nativeEnum(ChannelType)
})


export const CreateChannelModal = () => {

    const {isOpen,onClose,type,data}=useModal()
    const {channelType} =data
    const router = useRouter()

    const params=useParams();

    const isModalOpen = isOpen && type ==="createChannel"

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type:channelType || ChannelType.TEXT,
        }
    })

    useEffect(()=>{
        if(channelType){
            form.setValue("type",channelType)
        }else{
            form.setValue("type",ChannelType.TEXT)
        }
    },[channelType,form])
    
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url=queryString.stringifyUrl({
                url:"/api/channels",
                query:{
                    serverId:params.serverId
                }
            })
        
            await axios.post(url, values)
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
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 datk:text-secondary/70">
                                        Channel Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder=" Enter channel name" disabled={isLoading} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="type" render={({field})=>(
                                <FormItem>
                                    <FormLabel> Channel Type</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                                                <SelectValue placeholder="Select a channel type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type)=>(
                                                <SelectItem key={type} value={type} className='capitalize'>
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" type="submit" disabled={isLoading} className="">
                                Create
                            </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


