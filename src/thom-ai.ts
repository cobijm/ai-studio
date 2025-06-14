import { GoogleGenAI, Content } from "@google/genai";
import readline from 'readline/promises';
import chalk from 'chalk';
import { ContextFactory, ContextType } from './context-factory';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cavemanFace = `
   _______
  /       \
 |  .-. .-.|
 |  | | | ||
 |  \_/ \_/|
 |   ___   |
 |  (___)  |
  \_______/
`;

async function chooseAiPersona(rl: readline.Interface, factory: ContextFactory): Promise<ContextType> {
  const availablePersonas = factory.getAvailableContexts();

  while (true) {
    console.log(chalk.yellow("Please choose an AI persona to chat with:"));
    availablePersonas.forEach((persona, index) => {
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

async function main() {


  // console.log(chalk.blue.underline("Thom AI: wat thom doeing"));
  // console.log("------------------------------------");

  // Create the readline interface for command-line input/output
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Use a specific, current model name
  const model = "gemini-2.0-flash";


  const contextFactory = new ContextFactory();
  const chosenPersona = await chooseAiPersona(rl, contextFactory);
  const history = contextFactory.getContext(chosenPersona);

  async function chatLoop() {
    while (true) {
      const userInput: string = await rl.question(chalk.redBright("Thom: "));
      if (userInput.toLowerCase() === 'sleep') {
        console.log("Thom AI going to sleep...");
        rl.close();
        break;
      }

      try {
        // Use a "thinking" indicator for better UX
        process.stdout.write(chalk.green("Thom AI: ... "));
        // process.stdout.write(chalk.green(`Thom AI: ${cavemanFace} ... `));

        // The modern way to generate content with history
        const response = await ai.models.generateContent({
          model: model,
          contents: [
            ...history, // Spread the existing history
            { role: 'user', parts: [{ text: userInput }] } // Add the new user message
          ],
        });

        // The response text is a string
        const text: string = response.text;

        // Clear the "thinking" message and write the final response
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(chalk.green(`Thom AI: ${text}`));
        console.log("------------------------------------");


        // Update the history with both the user's prompt and the model's response
        history.push(
          { role: 'user', parts: [{ text: userInput }] },
          { role: 'model', parts: [{ text: text }] }
        );

      } catch (error: unknown) {
        // Robust error handling
        if (error instanceof Error) {
          console.error("\nAn error occurred:", error.message);
        } else {
          console.error("\nAn unknown error occurred:", error);
        }
      }
    }
  }

  // Start the conversation loop
  await chatLoop();
}

main();