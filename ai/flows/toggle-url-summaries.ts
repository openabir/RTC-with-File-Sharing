'use server';
/**
 * @fileOverview A flow to toggle URL summaries.
 *
 * - toggleUrlSummaries - A function that toggles URL summaries.
 * - ToggleUrlSummariesInput - The input type for the toggleUrlSummaries function.
 * - ToggleUrlSummariesOutput - The return type for the toggleUrlSummaries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToggleUrlSummariesInputSchema = z.object({
  enabled: z.boolean().describe('Whether URL summaries are enabled or not.'),
});
export type ToggleUrlSummariesInput = z.infer<typeof ToggleUrlSummariesInputSchema>;

const ToggleUrlSummariesOutputSchema = z.object({
  enabled: z.boolean().describe('Whether URL summaries are enabled or not.'),
});
export type ToggleUrlSummariesOutput = z.infer<typeof ToggleUrlSummariesOutputSchema>;

export async function toggleUrlSummaries(input: ToggleUrlSummariesInput): Promise<ToggleUrlSummariesOutput> {
  return toggleUrlSummariesFlow(input);
}

const toggleUrlSummariesFlow = ai.defineFlow(
  {
    name: 'toggleUrlSummariesFlow',
    inputSchema: ToggleUrlSummariesInputSchema,
    outputSchema: ToggleUrlSummariesOutputSchema,
  },
  async input => {
    return {enabled: input.enabled};
  }
);
