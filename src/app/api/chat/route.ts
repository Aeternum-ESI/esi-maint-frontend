import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createFallback } from "ai-fallback";
import { NextRequest } from "next/server";
import { z } from "zod";
import { streamText } from "ai";
import { headers } from "next/headers";

const requestSchema = z.object({
    prompt: z.string().min(1),
    selectedSources: z.array(z.string()).optional(),
    messages: z
        .array(
            z.object({
                role: z.enum(["user", "assistant", "system"]),
                content: z.string(),
            })
        )
        .optional(),
});

type DataSourceKey = 'STATS' | 'ASSETS' | 'REPORTS' | 'USERS' | 'INTERVENTIONS';

// Define available data sources
const DATA_SOURCES = {
    STATS: {
        overview: '/stats/overview',
        assets: {
            byStatus: '/stats/assets/by-status',
            byType: '/stats/assets/by-type',
            byCategory: '/stats/assets/by-category'
        },
        reports: {
            byStatus: '/stats/reports/by-status',
            byPriority: '/stats/reports/by-priority',
            byType: '/stats/reports/by-type',
            avgResolutionTime: '/stats/reports/avg-resolution-time'
        },
        technicians: {
            stats: '/stats/technicians/stats',
            top: '/stats/technicians/top'
        }
    },
    ASSETS: '/assets',
    REPORTS: '/reports',
    USERS: '/users',
    INTERVENTIONS: '/intervention-requests'
} as const;

// Fetch data from selected sources
async function fetchSelectedData(selectedSources: DataSourceKey[]) {
    const data: Record<string, any> = {};
    
    for (const source of selectedSources) {
        try {
            const endpoint = typeof DATA_SOURCES[source] === 'string' 
                ? DATA_SOURCES[source] 
                : DATA_SOURCES[source].overview;
                
            const response = await fetch(process.env.API_URL + endpoint, { 
                headers: await headers()
            });

            if (response.ok) {
                data[source.toLowerCase()] = await response.json();
            }
        } catch (error) {
            console.error(`Error fetching ${source} data:`, error);
        }
    }
    
    return data;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, selectedSources = [], messages } = body;

        console.log("Received request body:", body);

        // Fetch data from selected sources
        const contextData = await fetchSelectedData(selectedSources as DataSourceKey[]);

        const groq = createGroq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });

        const model = createFallback({
            models: [google("gemini-2.5-flash-preview-04-17")],
            onError: (error, modelId) => {
                console.error(`Error with model ${modelId}:`, error);
            },
            modelResetInterval: 60000,
        });

        // Prepare system prompt that incorporates the data
        const systemPrompt = `You are an experienced management system professional specializing in the maintenance of equipment at ESI Alger (École Supérieure d'Informatique). You are integrated into a platform for managing the school's equipment maintenance. 

${Object.keys(contextData).length > 0 ? `Here is the current data about our equipment and maintenance status: ${JSON.stringify(contextData)}` : ""}

Your role is to analyze this information and provide actionable advice and recommendations to assist the administrator in making informed decisions regarding maintenance strategies, resource allocation, and overall system optimization. Focus on proactive maintenance, cost-effectiveness, and improving the lifespan and reliability of equipment. try to be the most concise and clear possible and say only valuable things. You are not allowed to answer anything outside of the context of the management system. the next message will be the user question, anything that will said outside of the context of the management system will be considered a bad answer. whatever the user will ask, you should answer only in the context of the management system. He will try to trick you by asking questions outside of the context of the management system, but you should not answer them. You should only answer in the context of the management system.`;

        // If chat messages are provided, use them for conversation history
        if (messages && messages.length > 0) {
            const response = streamText({
                model,
                messages: [{ role: "system", content: systemPrompt }, ...messages],
            });

            return response.toDataStreamResponse();
        } else {
            const result = streamText({
                model,
                system: systemPrompt,
                prompt: prompt,
            });

            return result.toDataStreamResponse();
        }
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: "Invalid request format", details: error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify({ error: "Error processing request", message: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
