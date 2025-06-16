import { Content, GoogleGenAI } from "@google/genai";
import chalk from 'chalk';
import readline from 'readline/promises';

const model = "gemini-2.0-flash";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class ChatSession {
  private history: Content[];
  private personaName: string;

  constructor(personaName: string, initialHistory: Content[]) {
    this.personaName = personaName;
    this.history = [...initialHistory]; // Start with a copy of the initial history
  }

  /**
   * Starts the interactive chat loop.
   */
  public async start(rl: readline.Interface) {
    console.log(chalk.green(`${this.personaName}: wat thom doeing`));
    console.log("------------------------------------");

    while (true) {
      const userInput = await rl.question(chalk.redBright("Thom: "));

      if (userInput.toLowerCase() === 'sleep') {
    console.log(chalk.green(`${this.personaName} went to go lie down for a bit...`));
        break; // Exit the loop to end the session
      }

      try {
        const responseText = await this.getAiResponse(userInput);
        console.log(chalk.green(`${this.personaName}: ${responseText}`));
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
    // Show a thinking indicator for better UX
    const thinkingIndicator = chalk.green(`${this.personaName}: ... `);
    process.stdout.write(thinkingIndicator);

    const fullHistory: Content[] = [
      ...this.history,
      { role: 'user', parts: [{ text: userInput }] }
    ];

    const result = await ai.models.generateContent({
          model: model,
          contents: [
            ...fullHistory, // Spread the existing history
            { role: 'user', parts: [{ text: userInput }] } // Add the new user message
          ],
        });
    // const result = await genAI.getGenerativeModel({ model: model })
    //   .generateContent({ contents: fullHistory });
      
    const responseText = result.text;
    if (!responseText) {
      throw new Error('No response received from AI');
    }
    
    // Clear the "thinking..." line before printing the final response
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);

    // Update the history for the next turn
    this.history.push(
      { role: 'user', parts: [{ text: userInput }] },
      { role: 'model', parts: [{ text: responseText }] }
    );

    return responseText;
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red("\nAn error occurred:"), error.message);
    } else {
      console.error(chalk.red("\nAn unknown error occurred:"), error);
    }
  }
}