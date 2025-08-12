"use server";

/**
 * @fileOverview A service for extracting content from a URL.
 */

/**
 * Extracts the text content from a given URL.
 * This is a simplified implementation and may not work for all websites,
 * especially those that are heavily client-side rendered.
 * @param {string} url The URL to extract content from.
 * @returns {Promise<string>} A promise that resolves to the text content of the URL.
 */
export async function extractContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();
    // A very basic way to strip HTML tags.
    // For a real-world app, a more robust library like Cheerio or JSDOM would be better.
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    return `Could not retrieve content from the URL.`;
  }
}
