'use server';
import { db } from "@/firebase/admin";

 // server rendered file

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