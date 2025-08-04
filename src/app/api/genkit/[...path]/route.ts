import { GenerateUpcyclingIdeasInput } from '@/ai/flows/generate-upcycling-ideas'
import { classifyComponentFlow, } from '@/ai/flows/classify-component'
import { appRoute } from '@genkit-ai/next'

export const POST = appRoute(classifyComponentFlow)
