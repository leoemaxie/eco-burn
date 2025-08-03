'use server';

/**
 * @fileOverview Generates upcycling ideas for a given electronic component.
 *
 * - generateUpcyclingIdeas - A function that generates upcycling ideas.
 * - GenerateUpcyclingIdeasInput - The input type for the generateUpcyclingIdeas function.
 * - GenerateUpcyclingIdeasOutput - The return type for the generateUpcyclingIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUpcyclingIdeasInputSchema = z.object({
  componentType: z.string().describe('The type of electronic component to upcycle.'),
});
export type GenerateUpcyclingIdeasInput = z.infer<typeof GenerateUpcyclingIdeasInputSchema>;

const GenerateUpcyclingIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of upcycling ideas for the given component.'),
});
export type GenerateUpcyclingIdeasOutput = z.infer<typeof GenerateUpcyclingIdeasOutputSchema>;

export async function generateUpcyclingIdeas(input: GenerateUpcyclingIdeasInput): Promise<GenerateUpcyclingIdeasOutput> {
  return generateUpcyclingIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUpcyclingIdeasPrompt',
  input: {schema: GenerateUpcyclingIdeasInputSchema},
  output: {schema: GenerateUpcyclingIdeasOutputSchema},
  prompt: `You are an upcycling expert. Generate a list of creative upcycling ideas for the following electronic component type:

Component Type: {{{componentType}}}

Ideas:`,
});

const generateUpcyclingIdeasFlow = ai.defineFlow(
  {
    name: 'generateUpcyclingIdeasFlow',
    inputSchema: GenerateUpcyclingIdeasInputSchema,
    outputSchema: GenerateUpcyclingIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
