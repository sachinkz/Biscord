"use client"

import { useEffect, useState } from "react"

import axios from 'axios'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileUplaod } from "../file-uplaod"
import { useForm } from "react-hook-form"
import {Dialog, DialogContent, DialogDescription, DialogTitle , DialogFooter, DialogHeader } from "../ui/dialog"
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required"
    })
})

export const InitialModal = () => {

    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true);
    },[])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values)
            form.reset()
            router.refresh()
            window.location.reload();

        } catch (err) {
            console.log(err)
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
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
                                Create
                            </Button>

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}