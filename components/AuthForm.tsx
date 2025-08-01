"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormField from "./FormField"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
// sonner toast is a new version of toast to be used by shadcn

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const authFormSchema = (type: FormType) => {
  return z.object({
    name : type === 'sign-up' ? z.string().min(3) : z.string().optional(), 
    email: z.email(), 
    password: z.string().min(3), 
  })
} // dynamic schema 

const AuthForm = ({type}: {type: FormType}) => {
  const router = useRouter(); 
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", 
      email: "", 
      password: "" 
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type === 'sign-up'){
        toast.success('Account created successfully. Please sign in');
        router.push('/sign-in')
      }else{
        toast.success('Signed in successfully');
        router.push('/');
      }
    }catch(error){
      console.log(error)
      toast.error("There was an error: ${error}")
    }
  }
  const isSignIn = type === 'sign-in';
  return (
        <div className="card-border lg:min-w-[566px]">
          <div className="flex flex-col gap-6 card py-15 px-10">
            <div className="flex flex-row gap-2 justify-center">
              <Image 
                src='/logo.svg' 
                alt="logo" 
                height={32} 
                width={38}
              />
              <h2 className="text-primary-100">Prepwise</h2>
            </div>
            <h3>Practice Job Interviews with AI</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 form w-full">
                {!isSignIn && (
                  <FormField 
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                  />
                )}
                  <FormField 
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <FormField 
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                  />
                <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Sign up'}</Button>
              </form>
            </Form>
            <p className='text-center'>
              {isSignIn ? 'No account yet ?' : 'Have an account already ? '}
              <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                {!isSignIn ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
  )
}

export default AuthForm