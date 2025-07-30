import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Define the schema for structured output with exactly 2 cool facts
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the repository based on the README"),
  cool_facts: z.array(z.string()).length(2).describe("Exactly 2 interesting facts extracted from the README")
});

// Create the prompt template with more specific instructions
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that analyzes GitHub repositories based on their README content. Always provide exactly 2 cool facts, no more, no less."],
  ["human", "Summarize this github repository from this readme file content. Provide exactly 2 cool facts:\n\n{readme_content}"]
]);

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4-0125-preview", // Using GPT-4 for better analysis
  temperature: 0.7
});

// Create the chain
const summarizeChain = prompt.pipe(llm.withStructuredOutput(summarySchema));

// Function to generate the summary using the chain
export async function generateRepoSummary(readmeContent) {
  try {
    const result = await summarizeChain.invoke({
      readme_content: readmeContent
    });
    
    // Ensure we have exactly 2 facts
    const coolFacts = result.cool_facts.slice(0, 2);
    
    return {
      summary: result.summary,
      cool_facts: coolFacts
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      summary: "Unable to generate summary due to an error.",
      cool_facts: ["Error occurred during summary generation", "Please try again later"]
    };
  }
} 