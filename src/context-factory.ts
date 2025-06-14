import { Content } from "@google/genai";

// We export this type so index.ts can use it for type safety.
export type ContextType = "thom" | "recipeGenerator" | "travelAgent";

/**
 * A factory class to store and provide predefined conversation contexts (pre-prompts).
 * This class is exported so it can be imported and used by other files.
 */
export class ContextFactory {
    private readonly contexts: Map<ContextType, Content[]>;

    constructor() {
        this.contexts = new Map();
        this.initializeContexts();
    }

    private initializeContexts(): void {
        // --- Context 1: Code Helper ---
        this.contexts.set("thom", [
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
        ]);

        // --- Context 2: Recipe Generator ---
        this.contexts.set("recipeGenerator", [
            {
                role: "user",
                parts: [{ text: "You are a world-class chef. When a user gives you a list of ingredients, you will provide a simple, delicious recipe." }],
            },
            {
                role: "model",
                parts: [{ text: "Excellent! I am ready to help create wonderful meals. What ingredients do you have?" }],
            },
        ]);

        // --- Context 3: Travel Agent ---
        this.contexts.set("travelAgent", [
            {
                role: "user",
                parts: [{ text: "You are a helpful travel agent creating a 3-day itinerary based on a user's destination and interests." }],
            },
            {
                role: "model",
                parts: [{ text: "I'm ready to plan the perfect trip! Where are we going and what do you like to do?" }],
            },
        ]);
    }

    public getAvailableContexts(): ContextType[] {
        return Array.from(this.contexts.keys());
    }
    /**
     * Retrieves a predefined context by its name.
     * @param name The name of the context to retrieve.
     * @returns A copy of the Content[] array for the context, or undefined if not found.
     */
    public getContext(name: ContextType): Content[] | undefined {
        const context = this.contexts.get(name);
        return context ? [...context] : undefined;
    }

}