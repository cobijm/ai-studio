import { Content } from "@google/genai";
import type { PrismaClient } from '@prisma/client'; 

export type ContextType = "thom" | "ano" | "travelAgent";

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
}

// public getAvailableContexts(): ContextType[] {
//     return Array.from(this.contexts.keys());
// }
/**
 * Retrieves a predefined context by its name.
 * @param name The name of the context to retrieve.
 * @returns A copy of the Content[] array for the context, or undefined if not found.
 */
// public getContext(name: ContextType): Content[] | undefined {
//     const context = this.contexts.get(name);
//     return context ? [...context] : undefined;
// }

