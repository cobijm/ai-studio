import chalk from 'chalk';
import readline from 'readline/promises';
import { ChatSession } from './chat-session.js';
import { ContextFactory } from './context-factory.js';
import { chooseAiPersona } from './prompts.js';
import { prisma } from './db.js';

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
    const session = new ChatSession(chosenPersona, initialHistory, contextFactory);
    await session.start(rl);

  } catch (error) {
    console.error(chalk.bgRed("\nA fatal error occurred in the application:"), error);
  } finally {
    // 3. Cleanup: Ensure resources are always closed
    rl.close();
  }
}

main();