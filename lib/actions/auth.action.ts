'use server';
import { toast } from "sonner";
import { db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { auth } from '@/firebase/admin';
 // server rendered file
const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week in milliseconds
// we wanna create an action for a sign up
export async function signUp(params : SignUpParams){
    const { uid, name, email } = params; 
    try{
        const userRecord = await db.collection("users").doc(uid).get();
        if(userRecord.exists){
            return {
                success: false, 
                message: "User already exists"
            }
        }
        await db.collection("users").doc(uid).set({
            name, 
            email, 
            // profile URL
            // resume URl 
        })
    }catch(error : any){
        console.error("Error during sign up:", error);

        // handle some firebase specific errors
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false, 
                message: "This email is already in use"
            }
        }
        return {
            success: false, 
            message: 'Failed to create account.\n'
        }
    }
}

/**
 * The function `setSessionCookie` sets a session cookie with specified options like expiration time
 * and security settings.
 * @param {string} idToken - The `idToken` parameter is a string that represents the user's
 * authentication token, typically obtained after a successful authentication process. This token is
 * used to verify the user's identity and permissions when accessing protected resources or performing
 * actions within the application.
 */
export async function setSessionCookie(idToken : string){
    const cookieStore = await cookies(); 
    const cookie = cookieStore.get("session");
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}
export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            toast.error('User does not exist. Please create an account.');
            return {
                success: false,
                message: 'User does not exist. Please create an account.\n'
            }
        }
        await setSessionCookie(idToken);
        toast.success('Signed in successfully');
    }catch(error : any){
        console.error("Error during sign in:", error);
        return {
            success: false, 
            message: 'Failed to sign in.\n'
        }
    }
}