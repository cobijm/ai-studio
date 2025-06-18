import { Content } from "@google/genai";
import type { PrismaClient } from '@prisma/client';

export type ContextType = "thom" | "ano";

type HistoryContent = {
    role: 'user' | 'model';
    parts: { text: string }[];
};

/**
 * A factory class to store and provide predefined conversation contexts (pre-prompts).
 * This class is exported so it can be imported and used by other files.
 */
export class ContextFactory {

    private prisma: PrismaClient;

    // The constructor now requires a prisma client instance
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    /**
   * Fetches the list of available persona names directly from the database.
   */
    public async getAvailableContexts(): Promise<string[]> {
        const personas = await this.prisma.persona.findMany({
            select: {
                name: true,
            },
        });
        return personas.map((p: { name: string }): string => p.name);
    }

    /**
   * Fetches a specific persona's initial history from the database.
   */
    public async getContext(name: string): Promise<Content[]> {
        const persona = await this.prisma.persona.findUnique({
            where: { name: name },
        });

        if (!persona) {
            throw new Error(`Persona with name "${name}" not found.`);
        }

        // The history is stored as JSON, so we cast it back to Content[]
        return persona.initialHistory as Content[];
    }

    public async updatePersonaHistory(personaName: string, userInput: string, fullResponse: string) {
        const newContext: HistoryContent[] = [
            { role: 'user', parts: [{ text: userInput }] },
            { role: 'model', parts: [{ text: fullResponse }] }
        ];

        // Use a transaction to ensure atomicity (Read-Modify-Write is safe)
        const updatedPersona = await this.prisma.$transaction(async (tx) => {
            // 1. READ: Find the existing persona
            const existingPersona = await tx.persona.findUnique({
                where: { name: personaName },
            });

            if (existingPersona) {
                // 2. MODIFY: Combine the old and new history
                const currentHistory = (existingPersona.initialHistory as HistoryContent[]) || [];
                const newHistory = [...currentHistory, ...newContext]; // Correctly concatenates arrays

                // 3. WRITE: Update the persona with the full new history
                return tx.persona.update({
                    where: { name: personaName },
                    data: {
                        initialHistory: newHistory,
                    },
                });
            } else {
                // ----- CREATE PATH -----
                // If it doesn't exist, create it with the new context as the starting history.
                return tx.persona.create({
                    data: {
                        name: personaName,
                        initialHistory: newContext,
                    },
                });
            }
        });
        return updatedPersona;
    }
}