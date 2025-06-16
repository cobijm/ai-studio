import chalk from 'chalk';
import readline from 'readline/promises';
import { ChatSession } from './chat-session.js';
import { ContextFactory } from './context-factory.js';
import { chooseAiPersona } from './prompts.js';
import { prisma } from './db.js';

// async function chooseAiPersona(rl: readline.Interface, factory: ContextFactory): Promise<string> {
//   const availablePersonas = await factory.getAvailableContexts();
//   while (true) {
//     console.log(chalk.yellow("Please choose an AI persona to chat with:"));
//     availablePersonas.forEach((persona: any, index: number) => {
//       console.log(`  ${chalk.cyan(index + 1)}: ${persona}`);
//     });

//     const choice = await rl.question("Enter the number of your choice: ");
//     const choiceIndex = parseInt(choice) - 1;

//     if (choiceIndex >= 0 && choiceIndex < availablePersonas.length) {
//       const chosenPersona = availablePersonas[choiceIndex];
//       console.log(chalk.green(`You have chosen: ${chosenPersona}\n`));
//       return chosenPersona;
//     } else {
//       console.log(chalk.red("Invalid choice. Please try again.\n"));
//     }
//   }
// }

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