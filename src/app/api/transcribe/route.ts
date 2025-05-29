import { NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        
        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await audioFile.arrayBuffer();
        

        const response = await generateText({
            model: google('gemini-2.5-flash-preview-04-17'),
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Please transcribe this audio file. If there are any stutters, repetitions, or speech errors, clean them up and provide a refined, clear transcription. Focus on maintaining the original meaning while removing any disfluencies.'
                        },
                        {
                            type: 'file',
                            data: arrayBuffer,
                            mimeType: 'audio/wav',
                        }
                    ]
                }
            ],
        });

        return NextResponse.json({ 
            transcription: response.text 
        });

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: 'Error transcribing audio', details: (error as Error).message },
            { status: 500 }
        );
    }
}