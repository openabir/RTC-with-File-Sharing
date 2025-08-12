'use server';

/**
 * @fileOverview Summarizes the content of a URL.
 *
 * - summarizeUrl - A function that summarizes the content of a given URL.
 * - SummarizeUrlInput - The input type for the summarizeUrl function.
 * - SummarizeUrlOutput - The return type for the summarizeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractContent} from '@/services/content-extractor';

const SummarizeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to summarize.'),
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;

const SummarizeUrlOutputSchema = z.object({
  summary: z.string().describe('A summary of the URL content.'),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  return summarizeUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUrlPrompt',
  input: {schema: z.object({
    url: z.string().url(),
    content: z.string(),
  })},
  output: {schema: SummarizeUrlOutputSchema},
  prompt: `Summarize the content of the following URL in a concise manner:\n\nURL: {{{url}}}\n\nContent: {{{content}}}`,
});

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async input => {
    const content = await extractContent(input.url);
    const {output} = await prompt({url: input.url, content});
    return output!;
  }
);
