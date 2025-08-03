'use server';

import { classifyComponent, ClassifyComponentOutput } from '@/ai/flows/classify-component';

export async function runClassification(
  photoDataUri: string
): Promise<ClassifyComponentOutput | { error: string }> {
  try {
    const result = await classifyComponent({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error in classification flow:', error);
    return { error: 'Failed to classify the component. Please try again.' };
  }
}
