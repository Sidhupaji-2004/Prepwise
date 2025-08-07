import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/utils";
import { db } from "@/firebase/admin";

export async function GET(){
    return Response.json({
        success: true, 
        data: 'Thank you',  
    }, {
        status: 200
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, role, level, techstack, amount, userid } = body;

        if (!role || !level || !techstack) {
            return Response.json({
                success: false,
                error: 'Missing required fields: role, level, and techstack are required.',
            }, { status: 400 }); 
        }

        const { text: questions } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: `Prepare questions for a job interview.
                     The job role is ${role}.
                     The job experience level is ${level}.
                     The tech stack used in the job is: ${techstack}.
                     The focus between behavioural and technical questions should lean towards: ${type}.
                     The amount of questions required is: ${amount}.
                     Please return ONLY a valid JSON array of strings, like this: ["Question 1", "Question 2", "Question 3"].
                     Do not include any other text, markdown, or explanations.
                     The questions will be read by a voice assistant, so avoid special characters like "/", "*", or markdown formatting.`
        });

        
        let parsedQuestions;
        try {
            console.log("Raw AI Response:", questions);
            parsedQuestions = JSON.parse(questions);
        } catch (parseError) {
            console.error("💥 JSON Parse Error:", parseError);
            throw new Error("Failed to parse the response from the AI model.");
        }

        const interview = {
            role: role,
            type: type,
            level: level,
            techstack: techstack ? techstack.split(',') : [],
            questions: parsedQuestions,
            userId: userid,
            coverImage: getRandomInterviewCover(),
            createdAT: new Date().toISOString()
        };

        await db.collection('interviews').add(interview);

        return Response.json({
            success: true,
            data: interview,
        }, { status: 200 });

    } catch (error) {
        console.error("💥 An error occurred in POST /api/vapi/generate:", error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'An internal server error occurred.',
        }, { status: 500 });
    }
}