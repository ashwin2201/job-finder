"use client"

import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    resume: z.string().min(5, "Resume is required"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
})

const SubmitResume = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resume: "",
            fullName: "",
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Form values:", values);
        
        // Handle file upload
        const formData = new FormData();
        formData.append("resume", values.resume);
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        
        console.log("Form data ready to send:", formData);
        
        // generate ranked job data 
        try {
            const requestBody = {
                text: values.resume,
                fullName: values.fullName,
                email: values.email,
            }

            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/submit-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            if (res.ok) {
                console.log("Resume submitted successfully:");
                router.push('/job-feed');
            } else {
                const errorText = await res.text();
                console.error("Failed to submit resume:", errorText);
                console.error("Response status:", res.status);
            }
        } catch (err) {
            console.error(err);
        }

    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Submit Your Resume</h1>
            <p className="text-lg text-gray-700 mb-6">
                Please fill out the form below to submit your resume. We will review it and get back to you shortly.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter your full name.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="johndoe@gmail.com" {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter your email.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Upload Resume</FormLabel>
                        <FormControl>
                            <textarea 
                                {...field}
                                placeholder="Paste your resume text here..."
                                className="min-h-[200px] w-full p-3 border border-gray-300 rounded-md resize-vertical"
                            />
                        </FormControl>
                        <FormDescription>
                            Please paste your resume here.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
                </form>
            </Form>

        </div>
        )
    }

export default SubmitResume