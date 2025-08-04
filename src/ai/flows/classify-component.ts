// The classifyComponent flow uses the device camera to identify and classify electronic components.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyComponentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an electronic component, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyComponentInput = z.infer<typeof ClassifyComponentInputSchema>;

const ClassifyComponentOutputSchema = z.object({
  componentType: z.string().describe('The type of electronic component.'),
  recyclable: z.boolean().describe('Whether the component is recyclable.'),
  hazardFlag: z.boolean().describe('Whether the component contains hazardous materials.'),
  confidenceScore: z.number().describe('The confidence score of the classification (0-1).'),
});
export type ClassifyComponentOutput = z.infer<typeof ClassifyComponentOutputSchema>;

export async function classifyComponent(input: ClassifyComponentInput): Promise<ClassifyComponentOutput> {
  return classifyComponentFlow(input);
}

const classifyComponentPrompt = ai.definePrompt({
  name: 'classifyComponentPrompt',
  input: {schema: ClassifyComponentInputSchema},
  output: {schema: ClassifyComponentOutputSchema},
  prompt: `You are an AI expert in identifying electronic components and their recyclability.

  Analyze the image of the electronic component and determine its type, recyclability, potential hazards, and provide a confidence score.

  Photo: {{media url=photoDataUri}}

  Based on the image, provide the following information in JSON format:
  - componentType: The type of electronic component.
  - recyclable: Whether the component is recyclable (true or false).
  - hazardFlag: Whether the component contains hazardous materials (true or false).
  - confidenceScore: The confidence score of the classification (0-1).`,
});

export const classifyComponentFlow = ai.defineFlow(
  {
    name: 'classifyComponentFlow',
    inputSchema: ClassifyComponentInputSchema,
    outputSchema: ClassifyComponentOutputSchema,
  },
  async input => {
    const {output} = await classifyComponentPrompt(input);
    return output!;
  }
);
