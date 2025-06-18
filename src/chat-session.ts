import { Content, GoogleGenAI } from "@google/genai";
import chalk from 'chalk';
import readline from 'readline/promises';
import { ContextFactory } from './context-factory.js';

const model = "gemini-2.0-flash";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class ChatSession {
    private history: Content[];
    private personaName: string;
    private contextFactory: ContextFactory;

    constructor(personaName: string, initialHistory: Content[], contextFactory: ContextFactory) {
        this.personaName = personaName;
        this.history = [...initialHistory]; // Start with a copy of the initial history
        this.contextFactory = contextFactory;
    }

    /**
     * Starts the interactive chat loop.
     */
    public async start(rl: readline.Interface) {
        console.log(chalk.green(`${this.personaName} AI: wat thom doeing`));
        console.log("------------------------------------");

        while (true) {
            const userInput = await rl.question(chalk.redBright("Thom: "));

            if (userInput.toLowerCase() === 'sleep') {
                console.log(chalk.green(`${this.personaName} went to go lie down for a bit...`));
                break; // Exit the loop to end the session
            }

            try {
                await this.getAiResponse(userInput);
                console.log("------------------------------------");
            } catch (error) {
                this.handleError(error);
            }
        }
    }


    /**
     * Gets a response from the Generative AI model.
     */
    private async getAiResponse(userInput: string): Promise<string> {
        const fullHistory: Content[] = [
            ...this.history,
            { role: 'user', parts: [{ text: userInput }] }
        ];

        const result = await ai.models.generateContentStream({
            model: model,
            contents: [
                ...fullHistory, // Spread the existing history
                { role: 'user', parts: [{ text: userInput }] } // Add the new user message
            ],
            config: {
                temperature: 2.0, // Adjust the creativity of the response 0.1 - 2.0 
                maxOutputTokens: 200,
            }
        });

        let fullResponse = '';
        process.stdout.write(chalk.green(`${this.personaName} AI: `)); // Print the AI's name once

        for await (const chunk of result) {
            const chunkText = chunk.text ?? '';
            process.stdout.write(chunkText); // Print each chunk to the console without a newline
            fullResponse += chunkText; // Append the chunk to the full response string
        }
        process.stdout.write('\n'); // Add a final newline after the full response is printed

        // Update the history for the current chat next turn
        this.history.push(
            { role: 'user', parts: [{ text: userInput }] },
            { role: 'model', parts: [{ text: fullResponse }] }
        );

        this.contextFactory.updatePersonaHistory(this.personaName, userInput, fullResponse);

        return fullResponse;
    }

    private handleError(error: unknown) {
        if (error instanceof Error) {
            console.error(chalk.red("\nAn error occurred:"), error.message);
        } else {
            console.error(chalk.red("\nAn unknown error occurred:"), error);
        }
    }
}