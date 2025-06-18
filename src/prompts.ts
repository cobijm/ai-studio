import readline from 'readline/promises';
import { ContextFactory } from './context-factory.js';
import chalk from 'chalk';


export async function chooseAiPersona(rl: readline.Interface, factory: ContextFactory): Promise<string> {
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