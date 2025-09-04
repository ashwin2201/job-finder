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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from "date-fns"
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
    resume: z.string().min(5, "Resume is required"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    email: z.string().email("Please enter a valid email"),
    jobDescription: z.string().min(5, "Job description is required"),
    phone: z.string().min(8, "Phone number must be at least 8 digits"),
})

const SubmitResume = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resume: "",
            firstName: "",
            lastName: "",
            dateOfBirth: undefined,
            address: "",
            email: "",
            jobDescription: "",
            phone: "",
        },
    });

    const showJobListings = async (values: z.infer<typeof formSchema>) => {
        console.log("Form values:", values);

        const formData = {
            resumeTxt: values.resume,
            jobDescription: values.jobDescription,
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd") : null,
            address: values.address,
            phone: values.phone,
            email: values.email,
        }

        // generate ranked job data 
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/submit-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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

    const generateResume = async (values: z.infer<typeof formSchema>) => {
        console.log("Form values:", values);

        const payload = {
            resume_text: values.resume,
            job_description: values.jobDescription,
            // if you do not have kana collect them later
            first_name_kana: null,
            last_name_kana: null,
            dob: values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd") : null,
            address_en: values.address || null,
            phone: values.phone,
            email: values.email,
        };

        // generate ranked job data 
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            // show loading state
            

            if (res.ok) {
                console.log("Resume submitted successfully:");
                router.push('/generated-resume');
            } else {
                const errorText = await res.text();
                alert("Failed to submit resume");
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
                <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="John" 
                                        className="w-full px-4" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter your first name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Doe" 
                                    className="w-full px-4" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>
                                Please enter your last name.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                            />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Your date of birth is used to calculate your age.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input placeholder="Shinishikawa 3-20-3" {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter your address.
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
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                            <Input placeholder="+81 90-1234-5678" {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter your phone number.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Describe the job..." {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter the target job description.
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
                                className="w-full p-3 border border-gray-300 rounded-md resize-vertical"
                            />
                        </FormControl>
                        <FormDescription>
                            Please paste your resume here.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="button" onClick={form.handleSubmit(showJobListings)} className="mr-5">Show job listings</Button>
                <Button type="button" onClick={form.handleSubmit(generateResume)}>Generate 履歴書</Button>

                </form>
            </Form>

        </div>
        )
    }

export default SubmitResume