'use server'; // this is a server action
import { toast } from "sonner";
import { db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { auth } from '@/firebase/admin';
import { success } from "zod";
 // server rendered file
const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week in milliseconds
// we wanna create an action for a sign up
/**
 * The function `signUp` in TypeScript handles user sign up by checking if the user already exists in
 * the database and creating a new user if not, with error handling for Firebase specific errors.
 * @param {SignUpParams} params - The `params` object in the `signUp` function contains the following
 * properties:
 * @returns The `signUp` function returns an object with properties `success` and `message`. The
 * specific return values are as follows:
 */
export async function signUp(params : SignUpParams){
    const { uid, name, email } = params; 
    try{
        const userRecord = await db.collection("users").doc(uid).get();
        if(userRecord.exists){
            toast.error("User already exists. Please sign in");
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
        return {
            success: true, 
            message: "User created successfully"
        }
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
/**
 * The function `signIn` handles user sign-in by checking if the user exists, setting a session cookie,
 * and displaying appropriate messages.
 * @param {SignInParams} params - The `signIn` function takes in a parameter `params` of type
 * `SignInParams`, which likely contains the `email` and `idToken` needed for signing in a user. The
 * function attempts to sign in the user by first retrieving the user record using the provided email.
 * If the user record
 * @returns The function `signIn` returns an object with properties `success` and `message`. The
 * specific return values depend on the outcome of the sign-in process:
 * 1. If the user does not exist, it returns:
 *    ```
 *    {
 *        success: false,
 *        message: 'User does not exist. Please create an account.\n'
 *    }
 *    ```
 * 2. If there is an error during
 */
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

/**
 * Sign out user by clearing the session cookie
 */
export async function signOut(){
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

/**
 * Get the current user from session cookie
 */

export async function getCurrentUser() : Promise<User | null>{
    const cookieStore = await cookies(); 
    const sessionCookie = cookieStore.get("session")?.value; 
    if(!sessionCookie){
        return null; 
    }

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get(); 
        if(!userRecord.exists){
            return null; 
        }

        return {
            ...userRecord.data(), 
            id: userRecord.id
        } as User; 
    }catch(error : any){
        console.error("Error getting current user:", error);
        return null; 
    }
}


/**
 * Check if the user is authenticated by verifying the session cookie
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user
 */


export async function isAuthenticated(){
    const user = await getCurrentUser(); 
    return !!user; 
}