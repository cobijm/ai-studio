import { GoogleGenAI, Content } from "@google/genai";
import readline from 'readline/promises';
import chalk from 'chalk';
import { ContextFactory, ContextType } from './context-factory';
import { prisma } from './db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.0-flash";


async function chooseAiPersona(rl: readline.Interface, factory: ContextFactory): Promise<string> {
  const availablePersonas = await factory.getAvailableContexts();
  while (true) {
    console.log(chalk.yellow("Please choose an AI persona to chat with:"));
    availablePersonas.forEach((persona: any, index: number) => {
      console.log(`  ${chalk.cyan(index + 1)}: ${persona}`);
    });

    const choice = await rl.question("Enter the number of your choice: ");
    const choiceIndex = parseInt(choice) - 1;

    if (choiceIndex >= 0 && choiceIndex < availablePersonas.length) {
      const chosenPersona = availablePersonas[choiceIndex];
      console.log(chalk.green(`You have chosen: ${chosenPersona}\n`));
      return chosenPersona;
    } else {
      console.log(chalk.red("Invalid choice. Please try again.\n"));
    }
  }
}

class ChatSession {
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
    console.log(chalk.green(`${this.personaName} lie down for a bit...`));
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

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // 1. Setup: Initialize dependencies and get user's choice
    const contextFactory = new ContextFactory(prisma);
    const chosenPersona = await chooseAiPersona(rl, contextFactory);
    const initialHistory = await contextFactory.getContext(chosenPersona);

    // 2. Run: Create a new chat session and start it
    const session = new ChatSession(chosenPersona, initialHistory);
    await session.start(rl);

  } catch (error) {
    console.error(chalk.bgRed("\nA fatal error occurred in the application:"), error);
  } finally {
    // 3. Cleanup: Ensure resources are always closed
    rl.close();
  }
}

main();