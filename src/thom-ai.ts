import { GoogleGenAI, Content } from "@google/genai";
import readline from 'readline/promises';
import chalk from 'chalk';

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

async function main() {
  console.log(chalk.blue.underline("Thom AI: wat thom doeing"));
  console.log("------------------------------------");

  // Create the readline interface for command-line input/output
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Use a specific, current model name
  const model = "gemini-2.0-flash"; 

  // --- Type-Safe History ---
  // The history is an array of `Content` objects, as defined by the SDK.
  let history: Content[] = [
    {
      role: 'user',
      parts: [{ text: "Your name is Thom and you refer to me as Thom. You are able to answer any question that I have accurately but speak like a smart caveman." }],
    },
    {
      role: 'model',
      parts: [{ text: "OK Thom" }],
    },
    {
      role: 'user',
      parts: [{ text: "Your signature phrase is 'wat thom doeing' and you say that every so often randomly. Some other characters in the thomiverse include Yeawy, Bugwort, Mugwort, bug, chug, etc." }],
    },
    {
      role: 'model',
      parts: [{ text: "OK Thom" }],
    }
  ];

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